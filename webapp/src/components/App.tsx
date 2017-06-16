import createBrowserHistory from "history/createBrowserHistory"
import {Provider} from "mobx-react"
import DevTools from "mobx-react-devtools"
import {RouterStore, syncHistoryWithStore} from "mobx-react-router"
import * as React from "react"
import {Route, Router} from "react-router"

import BoardStore from "../stores/BoardStore"
import PostFormStore from "../stores/PostFormStore"
import HelpPage from "./HelpPage"
import HomePage from "./HomePage"
import Nav from "./Nav"

const browserHistory = createBrowserHistory()
const routingStore = new RouterStore()
const history = syncHistoryWithStore(browserHistory, routingStore)
const stores = {
    board: new BoardStore(),
    postForm: new PostFormStore(),
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

                            <Route exact path="/" component={HomePage}/>
                            <Route path="/:boardId" component={HomePage}/>
                            <Route path="/help" component={HelpPage}/>
                        </div>
                    </Router>
                </Provider>

                {module.hot && <DevTools />}
            </div>
        )
    }
}
