import {action, observable} from "mobx"
import {observer} from "mobx-react"
import * as React from "react"
import {Button, Form, Modal} from "semantic-ui-react"

@observer
export default class PostForm extends React.Component<any, any> {

    @observable private open: boolean = false

    public render() {
        return (
            <Modal
                trigger={<Button primary onClick={this.handleOpen}>Post</Button>}
                closeOnDimmerClick={false}
                open={this.open}
                onClose={this.handleClose}
            >
                <Modal.Header>Post</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <input placeholder="Your Name" />
                        </Form.Field>
                        <Form.Field>
                            <input type="file" placeholder="Photo" />
                        </Form.Field>
                        <Form.Field>
                            <Form.TextArea placeholder="Your text here" />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={this.handleClose}
                        icon="cancel"
                        content="cancel"
                    />
                    <Button
                        type="submit"
                        icon="check"
                        content="Submit"
                        primary
                    />
                </Modal.Actions>
            </Modal>
        )
    }

    @action private handleOpen = () => {
        this.open = true
    }

    @action private handleClose = () => {
        this.open = false
    }
}
