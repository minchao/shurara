import * as React from "react"
import {Container, Message} from "semantic-ui-react"

interface IProps {
    error: string
    errorMessage?: string
}

export default class Oops extends React.Component<IProps, any> {
    public render() {
        return (
            <div>
                <header>
                    <Container>
                        <h1>Oops!</h1>
                    </Container>
                </header>
                <main>
                    <Container>
                        <Message negative>
                            <Message.Header>{this.props.error}</Message.Header>
                            {this.props.errorMessage &&
                                <p>{this.props.errorMessage}</p>
                            }
                        </Message>
                    </Container>
                </main>
            </div>
        )
    }
}
