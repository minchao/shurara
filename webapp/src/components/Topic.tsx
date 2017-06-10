import {observer} from "mobx-react"
import * as React from "react"
import {Button, Container, Divider, Item} from "semantic-ui-react"

import TopicStore from "../stores/TopicStore"
import Post from "./Post"

interface IProps {
    topic: TopicStore
}

@observer
export default class Topic extends React.Component<IProps, any> {
    public render() {
        return (
            <div>
                <Item.Group divided>
                    {this.props.topic.posts.map((post) => (
                        <Post post={post} key={post.id}/>
                    ))}
                </Item.Group>

                <Divider/>

                <Container textAlign="center">
                    <Button onClick={this.pagingPrevious}>Prev</Button>
                    <Button onClick={this.pagingNext}>Next</Button>
                </Container>
            </div>
        )
    }

    private pagingPrevious = () => {
        // TODO
    }

    private pagingNext = () => {
        // TODO
    }
}
