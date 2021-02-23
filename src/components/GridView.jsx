import { Component, createRef } from "react";
import Axios from "axios";
import Card from "./Card";

import "../styles/grid-view.scss";

const PAGE_SIZE = 20;
const PATH = "https://api.elderscrollslegends.io/v1/cards";

class GridView extends Component {

    constructor (props) {
        super(props);
        this.endOfCardsRef = createRef();
        this.state = {
            page: 1,
            cards: [],
            isLoading: true,
            searchTerm: ""
        }

        this.handleScrollEvent = this.handleScrollEvent.bind(this);
        this.handleSearchInput = this.handleSearchInput.bind(this);
    }

    componentDidMount () {
        window.addEventListener("scroll", this.handleScrollEvent);
        this.getCards();
    }

    componentWillUnmount () {
        window.removeEventListener("scroll", this.handleScrollEvent);
    }

    componentDidUpdate (prevProps, prevState) {
        const { page, searchTerm } = this.state;

        if (prevState.page !== page || prevState.searchTerm !== searchTerm) {
            this.getCards();
        }
    }

    getCards () {
        this.setState({isLoading: true});
        const { page, cards, searchTerm } = this.state; 

        const params = `?page=${page}&pageSize=${PAGE_SIZE}&name=${searchTerm}`;
        Axios.get(PATH + params).then((res) => {
            const fetchedCards = res.data.cards;
            this.setState({cards: cards.concat(fetchedCards)});
        }).catch((err) => {
            alert("An error occurred.  Please realod the page and try again");
        }).finally(() => {
            this.setState({isLoading: false});
        });
    }

    handleScrollEvent (e) {
        if (!this.endOfCardsRef) {
            return;
        }

        const windowHeight = window.innerHeight;
        const refPosition = this.endOfCardsRef.current.getBoundingClientRect();
        if (refPosition.top < windowHeight) {
            this.setState({page: this.state.page + 1});
        }
    }

    handleSearchInput (e) {
        const value = e.target.value;
        
        const newState = {
            page: 0,
            searchTerm: value,
            cards: []
        }
        this.setState(newState);
    }

    buildCards () {
        const { cards, isLoading } = this.state;

        if (cards.length === 0 && isLoading === false) {
            return <p id="no-results-message">No Results</p>
        }

        const cardComponents = cards.map((card) => <Card { ...card } />);
        return (
            <div id="card-canvas">
                { cardComponents.concat(<div key="end-of-cards-ref" ref={ this.endOfCardsRef }></div>) }
            </div>
        ) 
    }

    render () {
        return (
            <div id="grid-view-wrapper">
                <div id="title">Elderscrolling</div>
                <input id="search"
                    placeholder="Search for cards by name..." 
                    onKeyUp={ this.handleSearchInput } />
                { this.buildCards() }
            </div>
        )
    }

}

export default GridView;