import {inject, observer} from "mobx-react"
import * as React from "react"
import {Container, Divider} from "semantic-ui-react"

import TopicStore from "../stores/TopicStore"
import Footer from "./Footer"
import Oops from "./Oops"
import Topic from "./Topic"

interface IProps {
    topic?: TopicStore
}

@inject("topic")
@observer
export default class HomePage extends React.Component<IProps, any> {
    public render() {
        const topic = this.props.topic.topic

        if (!topic) {
            return (
                <Oops error="Topic not found"/>
            )
        }

        return (
            <div>
                <header>
                    <Container>
                        <h1>{topic.name}</h1>
                        {topic &&
                            <p>{this.props.topic.topic.summary}</p>
                        }
                        <Divider/>
                    </Container>
                </header>

                <Topic topic={this.props.topic}/>

                <Footer/>
            </div>
        )
    }
}
