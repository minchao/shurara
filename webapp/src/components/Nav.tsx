import {Button} from "semantic-ui-react"
import {inject, observer} from "mobx-react"
import * as React from "react"

@inject("routing")
@observer
export default class Nav extends React.Component<any, any> {
    public render() {
        const {location, push, goBack} = this.props.routing

        return (
            <nav>
                <Button onClick={() => push("/")}>Home</Button>
                <Button onClick={() => push("/help")}>Help</Button>
                <Button onClick={() => goBack()}>Go Back</Button>

                <span>Current pathname: {location.pathname}</span>
            </nav>
        )
    }
}
