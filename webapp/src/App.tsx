import DevTools from "mobx-react-devtools"
import * as React from "react"

export default class App extends React.Component<any, any> {
    public render() {
        return (
            <div>
                <p>Hello, World</p>
                <DevTools />
            </div>
        )
    }
}
