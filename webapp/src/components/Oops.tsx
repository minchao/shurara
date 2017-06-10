import * as React from "react"
import {Message} from "semantic-ui-react"

interface IProps {
    error: string
    errorMessage?: string
}

export default class Oops extends React.Component<IProps, any> {
    public render() {
        return (
            <div>
                <header>
                    <h1>Oops!</h1>
                </header>
                <main>
                    <Message negative>
                        <Message.Header>{this.props.error}</Message.Header>
                        {this.props.errorMessage &&
                            <p>{this.props.errorMessage}</p>
                        }
                    </Message>
                </main>
            </div>
        )
    }
}
