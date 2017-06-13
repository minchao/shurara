import {inject, observer} from "mobx-react"
import {RouterStore} from "mobx-react-router"
import * as React from "react"
import {Icon} from "semantic-ui-react"

interface IProps {
    routing?: RouterStore
}

@inject("routing")
@observer
export default class Nav extends React.Component<IProps, any> {
    public render() {
        const {location, push, goBack} = this.props.routing

        const isActive = (path) => {
            return "item" + (path === location.pathname ? " active" : "")
        }

        return (
            <nav className="ui fixed menu navbar">
                <a className={isActive("/")} onClick={() => push("/")}><Icon name="home"/>Home</a>
                <a className={isActive("/help")} onClick={() => push("/help")}><Icon name="help"/>Help</a>
            </nav>
        )
    }
}
