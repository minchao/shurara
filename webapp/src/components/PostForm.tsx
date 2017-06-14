import {action, observable} from "mobx"
import {observer} from "mobx-react"
import * as React from "react"
import {Button, Form, Message, Modal} from "semantic-ui-react"

import {IError} from "../services/API"
import PostFormStore from "../stores/PostFormStore"

interface IProps {
    store: PostFormStore
}

@observer
export default class PostForm extends React.Component<IProps, any> {

    @observable private open: boolean = false

    @observable private loading: boolean = false

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
                    {this.props.store.error && errorMessage}
                    <Form>
                        <Form.Field>
                            <input
                                placeholder="Your Name"
                                onChange={this.handleNameChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <input
                                type="file"
                                placeholder="Photo"
                                onChange={this.handlePhotoChange}
                            />
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
        this.props.store.reset()
    }

    @action private handleClose = () => {
        this.open = false
    }

    @action private handleSubmit = () => {
        if (this.props.store.photo === undefined && this.props.store.content === "") {
            this.props.store.setError(true)
            return
        }
        this.loading = true
        this.props.store.post((josn: object, error?: IError) => {
            this.loading = false
            if (error === undefined) {
                this.open = false
            } else {
                this.props.store.setError(true)
            }
        })
    }

    private handleNameChange = (event: any) => {
        this.props.store.setName(event.target.value)
    }

    private handleContentChange = (event: any) => {
        this.props.store.setContent(event.target.value)
    }

    private handlePhotoChange = (event: any) => {
        this.props.store.setPhoto(event.target.files[0])
    }
}
