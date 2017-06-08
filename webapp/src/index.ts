import * as React from "react"
import * as ReactDOM from "react-dom"
import { AppContainer } from "react-hot-loader"

import App from "./App"

const render = (Component) => {
    ReactDOM.render(
        React.createElement(AppContainer, {}, React.createElement(Component)),
        document.getElementById("root"),
    )
}

render(App)

if (module.hot) {
    module.hot.accept("./App", () => {
        render(App)
    })
}
