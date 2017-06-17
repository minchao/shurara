import {inject, observer} from "mobx-react"
import {RouterStore} from "mobx-react-router"
import * as React from "react"
import {Button, Container, Divider, Item} from "semantic-ui-react"

import BoardStore from "../stores/BoardStore"
import PostFormStore from "../stores/PostFormStore"
import ImageModal from "./ImageModal"
import Post from "./Post"
import PostForm from "./PostForm"

interface IProps {
    routing?: RouterStore
    match: {params: {boardId: string}}
    board: BoardStore
    postForm?: PostFormStore
}

@inject("routing", "postForm")
@observer
export default class Board extends React.Component<IProps, any> {

    private handleOpenModalCb: (image: string) => void

    public render() {
        return (
            <main>
                <Container textAlign="right">
                    <PostForm
                        board={this.props.board}
                        form={this.props.postForm}
                        onSubmit={this.onPostFormSubmit}
                    />
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
                </Container>

                {this.props.board.paging &&
                <Container textAlign="center">
                    <Divider/>
                    <Button.Group className="paging">
                        {this.props.board.paging.previous &&
                        <Button
                            icon="left chevron"
                            labelPosition="left"
                            content="Prev"
                            onClick={this.pagingPrevious}
                        />
                        }
                        {this.props.board.paging.next &&
                        <Button
                            icon="right chevron"
                            labelPosition="right"
                            content="Next"
                            onClick={this.pagingNext}
                        />
                        }
                    </Button.Group>
                </Container>}
            </main>
        )
    }

    private openModal = (image: string) => {
        this.handleOpenModalCb(image)
    }

    private onPostFormSubmit = () => {
        this.props.routing.push(`${this.getBoardId()}?${Date.now()}`)
    }

    private pagingPrevious = () => {
        this.props.routing.push(this.getPagingPath(this.props.board.paging.previous))
    }

    private pagingNext = () => {
        this.props.routing.push(this.getPagingPath(this.props.board.paging.next))
    }

    private getPagingPath(apiPath: string): string {
        const index = apiPath.indexOf("?")
        const query = (index > -1) ? apiPath.substr(index, apiPath.length) : ""
        return `${this.getBoardId()}${query}`
    }

    private getBoardId(): string {
        return this.props.match.params.boardId ? this.props.match.params.boardId : ""
    }
}
