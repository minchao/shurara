import {Provider} from "mobx-react";
import * as React from "react";
import {Link, Route, Router, Switch} from "react-router-dom";

import Help from "./Help";
import Home from "./Home";

const Core = ({app}) =>
  <Provider {...app}>
    <Router history={app.history}>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/help">Help</Link></li>
          </ul>
        </nav>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/help" component={Help}/>
        </Switch>
      </div>
    </Router>
  </Provider>;

export default Core;
