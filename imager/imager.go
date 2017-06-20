package imager

import (
	"bytes"
	"image"
	"io"
	"net/url"
	"path/filepath"
	"sort"
	"strconv"
	"sync"

	_ "golang.org/x/image/webp"
	_ "image/gif"
	"image/jpeg"
	_ "image/png"

	"github.com/Sirupsen/logrus"
	"github.com/disintegration/imaging"
	"github.com/minchao/shurara/model"
	"github.com/minchao/shurara/storage"
	"github.com/rs/xid"
)

var (
	thumbnailSizes = []int{300, 1024}

	allowedFormats = map[string]string{
		"jpeg": "jpg",
		"png":  "png",
		"webp": "webp",
	}
)

type result struct {
	thumbnail *model.ImageThumbnail
	err       error
}

func Decode(r io.Reader) (img image.Image, cnf image.Config, format string, err error) {
	var bufA, bufB bytes.Buffer

	_, err = io.Copy(&bufA, io.TeeReader(r, &bufB))
	if err != nil {
		return img, cnf, format, err
	}

	cnf, format, err = image.DecodeConfig(&bufA)
	if err != nil {
		return img, cnf, format, err
	}

	img, err = imaging.Decode(&bufB)
	if err != nil {
		return img, cnf, format, err
	}

	return img, cnf, format, nil
}

type Imager struct {
	storage storage.Storage
}

func New(s storage.Storage) *Imager {
	return &Imager{storage: s}
}

func (i *Imager) CreateImage(data []byte) (*model.Image, *model.AppError) {
	img, cnf, format, err := Decode(bytes.NewReader(data))
	if err != nil {
		return nil, model.NewAppError("imager.create_image.decode_error", err.Error())
	}

	_, ok := allowedFormats[format]
	if !ok {
		return nil, model.NewAppError("imager.create_image.format_error", "Not allowed format")
	}

	filename := xid.New().String() + "." + format
	base, _ := url.Parse(i.storage.GetBaseURL())
	f, _ := url.Parse(filename)
	imageModel := model.NewImage(model.ImageOriginal{
		URL:    base.ResolveReference(f).String(),
		Width:  cnf.Width,
		Height: cnf.Height,
	})

	resultCh := i.storage.Put(filename, data)

	if thumbnails, _ := i.CreateThumbnails(img, format, filename); thumbnails != nil && len(thumbnails) > 0 {
		imageModel.Thumbnails = thumbnails
	}

	if result := <-resultCh; result.Err != nil {
		return nil, result.Err
	}

	return imageModel, nil
}

func (i *Imager) CreateThumbnails(img image.Image, format string, filePath string) ([]*model.ImageThumbnail, *model.AppError) {
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
				path := genThumbnailFilePath(filePath, "_"+strconv.Itoa(size), "."+format)
				w, h, err := i.process(imaging.Fit, img, format, size, size, path)

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
	format string,
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
