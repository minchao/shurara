import createBrowserHistory from "history/createBrowserHistory"
import {Provider} from "mobx-react"
import DevTools from "mobx-react-devtools"
import {RouterStore, syncHistoryWithStore} from "mobx-react-router"
import * as React from "react"
import {Route, Router} from "react-router"

import PostFormStore from "../stores/PostFormStore"
import TopicStore from "../stores/TopicStore"
import HelpPage from "./HelpPage"
import HomePage from "./HomePage"
import Nav from "./Nav"

import * as data from "../models/example_topic.json"

const browserHistory = createBrowserHistory()
const routingStore = new RouterStore()
const history = syncHistoryWithStore(browserHistory, routingStore)
const stores = {
    postForm: new PostFormStore(),
    routing: routingStore,
    topic: TopicStore.fromJS(data),
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
                            <Route path="/help" component={HelpPage}/>
                        </div>
                    </Router>
                </Provider>

                {module.hot && <DevTools />}
            </div>
        )
    }
}
