import * as React from "react";
import AppState from "./stores/AppState";

/*
    * webpack does static analysis over `import()` calls to split the app code
    * into chunks. We must include each import explicitly.
    */

export interface IRoute {
    // The actual route name, containing what URLs this route matches.
    // For example for defining a route for /books - you'd pass `books`.
    // parameters can be passed with `:` express like syntax, for example `/books/:id/`
    route: string;
    // This is how you tell what route gets what component, the decision can be made asynchronously
    // and data fetching can also occur here. Typically you"d initialize the data a page needs
    // to a consistent state here
    getComponent: (appState: AppState, params: object) => Promise<JSX.Element>;
    // This optionally (if passed) gets called after the routing happens. Server-Side-Rendering also
    // waits for this to finish before the route actually changes.
    // This is useful because routes typically need additional data loading logic _after_ they mount.
    // For example - a books component might require data after loading (and a loading indicator can be
    // shown in the meantime).
    onEnter?: (appState: AppState, params: object) => Promise<void>;
}

let routes: IRoute[];

const getRoute = (p) => p.then((mod) => mod.default);

export const defaultRoute: IRoute = {
    route: "/",
    async getComponent(appState, params) {
        const Home = await getRoute(import("./components/Home"));
        return <Home appState={appState}/>;
    },
};

routes = [
    {
        route: "/help",
        async getComponent(appState, params) {
            const Help = await getRoute(import("./components/Help"));
            return <Help/>;
        },
    },
];

export default routes;

export {routes as routes};
