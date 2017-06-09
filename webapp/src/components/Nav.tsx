import {inject, observer} from "mobx-react"
import * as React from "react"

@inject("routing")
@observer
export default class Nav extends React.Component<any, any> {
    public render() {
        const {location, push, goBack} = this.props.routing

        return (
            <nav>
                <span>Current pathname: {location.pathname}</span>
                <button onClick={() => push("/")}>Home</button>
                <button onClick={() => push("/help")}>Help</button>
                <button onClick={() => goBack()}>Go Back</button>
            </nav>
        )
    }
}
