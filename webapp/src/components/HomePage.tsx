import {inject, observer} from "mobx-react"
import * as React from "react"
import {Container, Divider} from "semantic-ui-react"

import BoardStore from "../stores/BoardStore"
import Board from "./Board"
import Footer from "./Footer"
import Oops from "./Oops"

interface IProps {
    board?: BoardStore
}

@inject("board")
@observer
export default class HomePage extends React.Component<IProps, any> {
    public render() {
        const board = this.props.board.board

        if (!board) {
            return (
                <Oops error="Board not found"/>
            )
        }

        return (
            <div>
                <header>
                    <Container>
                        <h1>{board.name}</h1>
                        {board &&
                            <p>{this.props.board.board.summary}</p>
                        }
                        <Divider/>
                    </Container>
                </header>

                <Board board={this.props.board}/>

                <Footer/>
            </div>
        )
    }
}
