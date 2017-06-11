import {action, observable} from "mobx"
import {observer} from "mobx-react"
import * as React from "react"
import {Button, Container, Divider, Image, Item, Modal} from "semantic-ui-react"

import TopicStore from "../stores/TopicStore"
import Post from "./Post"

interface IProps {
    topic: TopicStore
}

@observer
export default class Topic extends React.Component<IProps, any> {

    @observable public isModalOpen = false

    public modalImage: string

    public render() {
        return (
            <div>
                <Item.Group divided>
                    {this.props.topic.posts.map((post) => (
                        <Post
                            post={post}
                            key={post.id}
                            openModal={this.openModal}
                        />
                    ))}
                </Item.Group>

                <Modal basic={true}
                       open={this.isModalOpen}
                       onClose={this.closeModal}
                       style={{textAlign: "center"}}
                >
                    <Image wrapped src={this.modalImage} />
                </Modal>

                <Divider/>

                <Container textAlign="center">
                    <Button onClick={this.pagingPrevious}>Prev</Button>
                    <Button onClick={this.pagingNext}>Next</Button>
                </Container>
            </div>
        )
    }

    @action private openModal = (src: string) => {
        this.modalImage = src
        this.isModalOpen = true
    }

    @action private closeModal = () => {
        this.isModalOpen = false
    }

    private pagingPrevious = () => {
        // TODO
    }

    private pagingNext = () => {
        // TODO
    }
}
