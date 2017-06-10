import {inject, observer} from "mobx-react"
import * as React from "react"
import {Divider} from "semantic-ui-react"

import TopicStore from "../stores/TopicStore"
import Oops from "./Oops"
import Topic from "./Topic"

interface IProps {
    topic?: TopicStore
}

@inject("topic")
@observer
export default class Home extends React.Component<IProps, any> {
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
                    <h1>{topic.name}</h1>
                    {topic &&
                        <p>{this.props.topic.topic.summary}</p>
                    }
                </header>

                <Divider/>

                <main>
                    <Topic topic={this.props.topic}/>
                </main>
            </div>
        )
    }
}
