import {observer} from "mobx-react"
import * as React from "react"
import {Button, Container, Divider, Item} from "semantic-ui-react"

import TopicStore from "../stores/TopicStore"
import ImageModal from "./ImageModal"
import Post from "./Post"
import PostForm from "./PostForm"

interface IProps {
    topic: TopicStore
}

@observer
export default class Topic extends React.Component<IProps, any> {

    private handleOpenModalCb: (image: string) => void

    public render() {
        return (
            <div>
                <Container textAlign="right">
                    <PostForm/>
                    <Divider/>
                </Container>

                <ImageModal
                    openCallback={(cb: (image: string) => void) => {this.handleOpenModalCb = cb}}
                />

                <Container>
                    <Item.Group divided>
                        {this.props.topic.posts.map((post) => (
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
                    <Button onClick={this.pagingPrevious}>Prev</Button>
                    <Button onClick={this.pagingNext}>Next</Button>
                </Container>
            </div>
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
