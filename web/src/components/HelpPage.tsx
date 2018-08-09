import * as React from "react"
import {Container} from "semantic-ui-react"

import Footer from "./Footer"

export default class HelpPage extends React.Component<any, any> {
    public render() {
        return (
            <div>
                <header>
                    <Container>
                        <h1>Help</h1>
                    </Container>
                </header>

                <main>
                    <Container>
                        <p>...</p>
                    </Container>
                </main>

                <Footer/>
            </div>
        )
    }
}
