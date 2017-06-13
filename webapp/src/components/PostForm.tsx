import {action, observable} from "mobx"
import {inject, observer} from "mobx-react"
import * as React from "react"
import {Button, Form, Message, Modal} from "semantic-ui-react"

@inject("postForm")
@observer
export default class PostForm extends React.Component<any, any> {

    @observable private open: boolean = false

    @observable private loading: boolean = false

    @observable private error: boolean = false

    @observable private title: string

    @observable private content: string

    public render() {
        const errorMessage = (
            <Message negative>
                <Message.Header>Post failed</Message.Header>
            </Message>
        )

        return (
            <Modal
                trigger={
                    <Button
                        icon="add"
                        content="Post"
                        onClick={this.handleOpen}
                        primary
                    />
                }
                closeOnDimmerClick={false}
                open={this.open}
                onClose={this.handleClose}
            >
                <Modal.Content>
                    {this.error && errorMessage}
                    <Form>
                        <Form.Field>
                            <input
                                placeholder="Your Name"
                                onChange={this.handleTitleChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <input type="file" placeholder="Photo"/>
                        </Form.Field>
                        <Form.Field>
                            <Form.TextArea
                                placeholder="Your text here"
                                onChange={this.handleContentChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        content="Cancel"
                        icon="cancel"
                        onClick={this.handleClose}
                    />
                    <Button
                        primary
                        type="submit"
                        content="Submit"
                        icon="add"
                        loading={this.loading}
                        onClick={this.handleSubmit}
                    />
                </Modal.Actions>
            </Modal>
        )
    }

    @action private handleOpen = () => {
        this.open = true
        this.loading = false
        this.error = false
    }

    @action private handleClose = () => {
        this.open = false
    }

    @action private handleSubmit = () => {
        this.loading = true

        setTimeout(() => {
            this.loading = false
            this.error = true
        }, 500)
    }

    @action private handleTitleChange = (event: any) => {
        this.title = event.target.value
    }

    @action private handleContentChange = (event: any) => {
        this.content = event.target.value
    }
}
