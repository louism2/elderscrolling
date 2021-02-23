import { Component } from "react";
import Axios from "axios";

const PAGE_SIZE = 20;
const PATH = "https://api.elderscrollslegends.io/v1/cards";

class GridView extends Component {

    constructor (props) {
        super(props);
        this.state = {
            page: 0,
            cards: []
        }
    }

    componentDidMount () {
        this.getCards();
    }

    getCards () {
        const { page, cards } = this.state; 
        const params = `?page=${page}&pageSize=${PAGE_SIZE}`;
        Axios.get(PATH + params).then((res) => {
            const fetchedCards = res.data.cards;
            this.setState({cards: cards.concat(fetchedCards)});
        }).catch((err) => {

        })
    }

    render () {
        return (
            <div id="wrapper">
                { this.state.cards.map((card) => JSON.stringify(card))}
            </div>
        )
    }

}

export default GridView;