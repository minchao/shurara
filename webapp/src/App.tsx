import * as React from "react"
import DevTools from "mobx-react-devtools"

export default class App extends React.Component<any, any> {
    render() {
        return (
            <div>
                <p>Hello, World</p>
                <DevTools />
            </div>
        )
    }
}
