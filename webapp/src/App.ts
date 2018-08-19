import {action, configure, observable} from "mobx";
import {Router} from "routes";

import {defaultRoute, IRoute, routes} from "./routes";
import AppState, {IAppStateProps} from "./stores/AppState";

configure({
  enforceActions: true,
});

const hasWindow = typeof window !== "undefined";

// This class represents our main react application, you typically do not
// need to edit this code yourself at all.
class App {
  // the main element we"re rendering, this reacts to route changes (MobX).
  @observable public route: React.ReactElement<any> = null;
  // our main app state, this is available in your router
  @observable public appState: AppState;
  // our router
  private router: Router<IRoute>;

  private pushState: any;
  private replaceState: any;
  private onpopstate: any;

  constructor(appState?: IAppStateProps, router?: Router<IRoute>) {

    // we optionally reload the state useful for hot reload and server-side rendering,
    // but also as an extension point for restoring the data from localStorage.
    this.appState = new AppState().reload(appState);

    // initialize our router, or optionally pass it to the constructor
    if (!router) {
      this.router = Router<IRoute>();
      routes.forEach((r) => this.router.addRoute(r.route, r));
    } else {
      this.router = router;
    }

    this.hookHistory();
  }

  @action public setRoute = (component) => {
    this.route = component;
  }

  public unload() {
    window.onpopstate = this.onpopstate;
    history.pushState = this.pushState;
    history.replaceState = this.replaceState;
    this.appState.unload();
  }

  private async updateLocation(pathname = hasWindow ? location.pathname : "/") {
    const match = this.router.match(pathname);
    const params = match ? match.params : {};
    const route = match ? match.fn : defaultRoute;
    const onEnter = route.onEnter || (() => Promise.resolve());
    route.getComponent(this.appState, params).then(this.setRoute);
    await onEnter.call(route, this.appState, params);
  }

  private hookHistory() {
    this.updateLocation();

    if (typeof history !== "undefined") {
      this.pushState = history.pushState;
      history.pushState = (...args) => {
        this.pushState.apply(history, args);
        this.updateLocation();
      };

      this.replaceState = history.replaceState;
      history.replaceState = (...args) => {
        this.replaceState.apply(history, args);
        this.updateLocation();
      };

      this.onpopstate = window.onpopstate;
      window.onpopstate = (e: PopStateEvent) => {
        if (this.onpopstate) {
          this.onpopstate.apply(window, e);
        }
        this.updateLocation();
      };
    }
  }
}

export default App;
