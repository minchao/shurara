import * as React from "react"
import * as ReactDOM from "react-dom"
import {AppContainer} from "react-hot-loader"

import "semantic-ui-css/semantic.min.css"

import App from "./components/App"

import "./styles/index.css"

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        document.getElementById("root"),
    )
}

render(App)

if (IS_DEV && module.hot) {
    module.hot.accept("./components/App", () => {
        render(App)
    })
}
