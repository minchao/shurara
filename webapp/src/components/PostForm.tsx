import * as React from "react"
import {Button, Form, Modal} from "semantic-ui-react"

export default class PostForm extends React.Component<any, any> {
    public render() {
        return (
            <Modal trigger={<Button primary>Post</Button>}>
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
}
