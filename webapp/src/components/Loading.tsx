import * as React from "react"
import {Container, Icon, Message} from "semantic-ui-react"

export default class Loading extends React.Component<any, any> {
    public render() {
        return (
            <div>
                <header>
                </header>
                <main>
                    <Container>
                        <Message icon>
                            <Icon name="circle notched" loading />
                            <Message.Content>
                                <Message.Header>Loading ...</Message.Header>
                            </Message.Content>
                        </Message>
                    </Container>
                </main>
            </div>
        )
    }
}
