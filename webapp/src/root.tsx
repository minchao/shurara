import {observer} from "mobx-react";
import DevTools from "mobx-react-devtools";
import * as React from "react";

import App from "./App";
import Core from "./components/Core";

interface IProps {
  app: App;
}

@observer
class Root extends React.Component<IProps, {}> {

  public render() {
    return (
      <div>
        <Core app={this.props.app}/>
        <DevTools/>
      </div>
    );
  }
}

export default Root;
