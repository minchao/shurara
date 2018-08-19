import {observer} from "mobx-react";
import * as React from "react";

import AppState from "../stores/AppState";

@observer
class Home extends React.Component<{ appState: AppState }, any> {

  public render() {
    return (
      <div className="home">
        <h1>
          Welcome to the app!
        </h1>
        <p>timer: {this.props.appState.timer}</p>
        <button onClick={this.onClick}>Reset</button>
      </div>
    );
  }

  private onClick = () => {
    this.props.appState.resetTimer();
  }
}

export default Home;
