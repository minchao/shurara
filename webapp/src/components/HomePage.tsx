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
    routing: RouterStore
    match: {params: {boardId: string}}
    board: BoardStore
}

@inject("routing", "board")
@observer
export default class HomePage extends React.Component<IProps, any> {

    public componentDidMount() {
        this.props.board.location = this.getCurrentLocation()
        this.fetchData()
    }

    public componentDidUpdate(prevProps) {
        const currentLocation = this.getCurrentLocation()
        if (this.props.board.location !== currentLocation) {
            this.props.board.location = currentLocation
            this.fetchData()
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

                    <Board board={board} match={this.props.match}/>

                    <Footer/>
                </div>
            )
        }
    }

    private getCurrentLocation(): string {
        return this.props.routing.location.pathname + this.props.routing.location.search
    }

    private fetchData() {
        this.props.board.fetch(this.props.match.params.boardId, this.props.routing.location.search)
    }
}
