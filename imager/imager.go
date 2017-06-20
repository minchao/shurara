package imager

import (
	"bytes"
	"image"
	_ "image/gif"
	"image/jpeg"
	_ "image/png"
	"io"
	"net/url"
	"path/filepath"
	"sort"
	"strconv"
	"sync"

	"github.com/Sirupsen/logrus"
	"github.com/disintegration/imaging"
	"github.com/minchao/shurara/model"
	"github.com/minchao/shurara/storage"
)

var (
	thumbnailSizes = []int{300, 1024}
)

type result struct {
	thumbnail *model.ImageThumbnail
	err       error
}

func Decode(r io.Reader) (image.Image, error) {
	return imaging.Decode(r)
}

type Imager struct {
	storage storage.Storage
}

func New(s storage.Storage) *Imager {
	return &Imager{storage: s}
}

func (i *Imager) CreateThumbnails(img image.Image, filePath string) ([]*model.ImageThumbnail, *model.AppError) {
	var (
		channel    = make(chan result, len(thumbnailSizes))
		wait       = sync.WaitGroup{}
		thumbnails = []*model.ImageThumbnail{}
		imgWidth   = img.Bounds().Dx()
	)

	for _, size := range thumbnailSizes {
		if imgWidth >= size {
			wait.Add(1)

			base, _ := url.Parse(i.storage.GetBaseURL())

			go func(size int) {
				path := genThumbnailFilePath(filePath, "_"+strconv.Itoa(size), ".jpg")
				w, h, err := i.process(imaging.Fit, img, size, size, path)

				r := result{err: err}

				if err == nil {
					f, _ := url.Parse(path)
					r.thumbnail = &model.ImageThumbnail{
						URL:    base.ResolveReference(f).String(),
						Width:  w,
						Height: h,
					}
				}

				channel <- r
				wait.Done()
			}(size)
		}
	}

	go func() {
		wait.Wait()
		close(channel)
	}()

	for r := range channel {
		if r.err != nil {
			logrus.Errorf("imager.create_thumbnails.error: %s", r.err.Error())
			continue
		}
		thumbnails = append(thumbnails, r.thumbnail)
	}

	sort.Sort(model.ImageThumbnailByWidth(thumbnails))

	return thumbnails, nil
}

func (i *Imager) process(
	proc func(image.Image, int, int, imaging.ResampleFilter) *image.NRGBA,
	image image.Image,
	width,
	height int,
	path string,
) (w, h int, err error) {

	thumbnail := proc(image, width, height, imaging.Lanczos)

	var thumbnailBuff bytes.Buffer
	err = jpeg.Encode(&thumbnailBuff, thumbnail, &jpeg.Options{Quality: 85})
	if err != nil {
		return w, h, err
	}

	w = thumbnail.Bounds().Dx()
	h = thumbnail.Bounds().Dy()

	result := <-i.storage.Put(path, thumbnailBuff.Bytes())
	if result.Err != nil {
		return w, h, result.Err
	}

	return w, h, nil
}

func genThumbnailFilePath(filePath, suffix, newExt string) string {
	ext := filepath.Ext(filePath)
	pathWithoutExt := filePath[0 : len(filePath)-len(ext)]

	return pathWithoutExt + suffix + newExt
}
