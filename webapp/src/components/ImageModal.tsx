import {action, observable} from "mobx"
import {observer} from "mobx-react"
import * as React from "react"
import {Image, Modal} from "semantic-ui-react"

interface IProps {
    openCallback: (cb: (image: string) => void) => void
}

@observer
export default class ImageModal extends React.Component<IProps, any> {

    private image: string

    @observable private open: boolean = false

    public render() {
        this.props.openCallback(this.handleOpen)

        return (
            <Modal basic={true}
                   open={this.open}
                   onClose={this.handleClose}
                   style={{textAlign: "center"}}
            >
                <Image wrapped src={this.image}/>
            </Modal>
        )
    }

    @action private handleOpen = (image: string) => {
        this.image = image
        this.open = true
    }

    @action private handleClose = () => {
        this.open = false
    }
}
