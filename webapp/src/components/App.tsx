import createBrowserHistory from "history/createBrowserHistory"
import {Provider} from "mobx-react"
import DevTools from "mobx-react-devtools"
import {RouterStore, syncHistoryWithStore} from "mobx-react-router"
import * as React from "react"
import {Route, Router} from "react-router"

import Help from "./Help"
import Home from "./Home"
import Nav from "./Nav"

const browserHistory = createBrowserHistory()
const routingStore = new RouterStore()
const history = syncHistoryWithStore(browserHistory, routingStore)
const stores = {
    routing: routingStore,
}

export default class App extends React.Component<any, any> {
    public render() {
        return (
            <div>
                <Provider {...stores}>
                    <Router history={history}>
                        <div>
                            <Nav/>

                            <Route exact path="/" component={Home}/>
                            <Route path="/help" component={Help}/>
                        </div>
                    </Router>
                </Provider>

                {module.hot && <DevTools />}
            </div>
        )
    }
}
