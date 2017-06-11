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
            <main>
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
