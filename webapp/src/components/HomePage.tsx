import {inject, observer} from "mobx-react"
import {RouterStore} from "mobx-react-router"
import * as React from "react"
import {Container, Divider} from "semantic-ui-react"

import BoardStore from "../stores/BoardStore"
import Board from "./Board"
import Footer from "./Footer"
import Loading from "./Loading"
import Oops from "./Oops"

interface IProps {
    routing?: RouterStore
    board?: BoardStore
    match: {params: {boardId: string}}
}

@inject("routing", "board")
@observer
export default class HomePage extends React.Component<IProps, any> {

    private prevLocation: string

    public componentDidMount() {
        const board = (this.props.match.params.boardId) ? this.props.match.params.boardId : ""
        this.props.board.fetch(board)
        this.prevLocation = this.getCurrentLocation()
    }

    public componentDidUpdate(prevProps) {
        const currentLocation = this.getCurrentLocation()
        if (this.prevLocation !== currentLocation) {
            this.prevLocation = currentLocation
            this.props.board.fetch(currentLocation)
        }
    }

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

    private getCurrentLocation(): string {
        return this.props.routing.location.pathname + this.props.routing.location.search
    }
}
