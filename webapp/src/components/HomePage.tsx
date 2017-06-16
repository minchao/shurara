import {inject, observer} from "mobx-react"
import * as React from "react"
import {Container, Divider, Icon, Message} from "semantic-ui-react"

import BoardStore from "../stores/BoardStore"
import Board from "./Board"
import Footer from "./Footer"
import Loading from "./Loading"
import Oops from "./Oops"

interface IProps {
    board?: BoardStore
}

@inject("board")
@observer
export default class HomePage extends React.Component<IProps, any> {
    public render() {
        const board = this.props.board

        if (board.loading) {
            return (
                <Loading/>
            )
        } else {
            if (!board.board) {
                return (
                    <Oops error="Board not found"/>
                )
            }

            return (
                <div>
                    <header>
                        <Container>
                            <h1>{board.board.name}</h1>
                            {board.board.summary && <p>{board.board.summary}</p>}
                            <Divider/>
                        </Container>
                    </header>

                    <Board board={board}/>

                    <Footer/>
                </div>
            )
        }
    }
}
