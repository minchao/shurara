import {inject, observer} from "mobx-react";
import * as React from "react";

import AppState from "../stores/AppState";

interface IProps {
  appState: AppState;
}

@inject("appState")
@observer
class Home extends React.Component<IProps, any> {

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
