import * as React from "react"
import {Container, Divider} from "semantic-ui-react"

export default class Footer extends React.Component<any, any> {
    public render() {
        return (
            <footer style={{marginBottom: 40}}>
                <Container textAlign="center">
                    <Divider/>
                    <p>shurara</p>
                </Container>
            </footer>
        )
    }
}
