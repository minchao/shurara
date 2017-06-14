import {inject, observer} from "mobx-react"
import * as React from "react"
import {Button, Container, Divider, Item} from "semantic-ui-react"

import BoardStore from "../stores/BoardStore"
import PostFormStore from "../stores/PostFormStore"
import ImageModal from "./ImageModal"
import Post from "./Post"
import PostForm from "./PostForm"

interface IProps {
    board: BoardStore
    postForm?: PostFormStore
}

@inject("postForm")
@observer
export default class Board extends React.Component<IProps, any> {

    private handleOpenModalCb: (image: string) => void

    public render() {
        return (
            <main>
                <Container textAlign="right">
                    <PostForm board={this.props.board} form={this.props.postForm}/>
                    <Divider/>
                </Container>

                <ImageModal
                    openCallback={(cb: (image: string) => void) => {this.handleOpenModalCb = cb}}
                />

                <Container>
                    <Item.Group divided>
                        {this.props.board.posts.map((post) => (
                            <Post
                                post={post}
                                key={post.id}
                                openModal={this.openModal}
                            />
                        ))}
                    </Item.Group>

                    <Divider/>
                </Container>

                <Container textAlign="center">
                    <Button.Group className="paging">
                        <Button
                            icon="left chevron"
                            labelPosition="left"
                            content="Prev"
                            onClick={this.pagingPrevious}
                        />
                        <Button
                            icon="right chevron"
                            labelPosition="right"
                            content="Next"
                            onClick={this.pagingNext}
                        />
                    </Button.Group>
                </Container>
            </main>
        )
    }

    private openModal = (image: string) => {
        this.handleOpenModalCb(image)
    }

    private pagingPrevious = () => {
        // TODO
    }

    private pagingNext = () => {
        // TODO
    }
}
