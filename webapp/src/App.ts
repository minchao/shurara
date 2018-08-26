import createBrowserHistory from "history/createBrowserHistory";
import {configure, observable} from "mobx";
import {RouterStore, syncHistoryWithStore, SynchronizedHistory} from "mobx-react-router";

import AppState, {IAppStateProps} from "./stores/AppState";

configure({
  enforceActions: true,
});

// This class represents our main react application, you typically do not
// need to edit this code yourself at all.
class App {
  // our main app state, this is available in your router
  public appState: AppState;
  public routing: RouterStore;
  public history: SynchronizedHistory;

  constructor(appState?: IAppStateProps) {
    // we optionally reload the state useful for hot reload and server-side rendering,
    // but also as an extension point for restoring the data from localStorage.
    this.appState = new AppState().reload(appState);
    this.routing = new RouterStore();
    this.history = syncHistoryWithStore(createBrowserHistory(), this.routing);
  }

  public unload() {
    this.appState.unload();
  }
}

export default App;
