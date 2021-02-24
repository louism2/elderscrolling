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

        // Used as a synchronous means of identifying when the component
        // is fetching cards.  We use this to short-circuit incrementing
        // the 'page' state variable in the 'onScrollHandler' function.
        this.isFetchingCards = false;
        // Used to alleviate flickering of the 'loading' dialog.  We add
        // a 600ms timeout after we get the API response so the loading
        // dialog doesn't appear/disappear too quickly.
        this.loadingTimeout = null;
        // If the API returns fewer results than the 'PAGE_SIZE' then we
        // know that we've reached the end of the cards for our given
        // search criteria and we should stop sending requests to the API.
        this.endOfSearchResults = false;
        // Used to debounce requests to the API when searching by card name.
        // Helps prevent flooding the API with requests and helps prevent 
        // race conditions with multiple requests in-flight.
        this.requestTimeout = null;

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
        const { page, cards, searchTerm } = this.state; 

        clearTimeout(this.loadingTimeout);
        this.setState({isLoading: true});

        const params = `?page=${page}&pageSize=${PAGE_SIZE}&name=${searchTerm}`;
        Axios.get(PATH + params).then((res) => { 
            const fetchedCards = res.data.cards;
            if (fetchedCards.length < PAGE_SIZE) {
                this.endOfSearchResults = true;
            }
            this.setState({cards: cards.concat(fetchedCards)});
        }).catch((err) => {
            alert("An error occurred.  Please reload the page and try again");
        }).finally(() => {
            this.isFetchingCards = false;
            this.loadingTimeout = setTimeout(() => 
                this.setState({isLoading: false})
            , 600);
        });
    }

    handleScrollEvent (e) {
        if (!this.endOfCardsRef?.current || 
            this.isFetchingCards ||
            this.endOfSearchResults) {
            return;
        }

        // As soon as the DOM ref is scrolled into view we want to fire
        // an API request to get the next page of cards.
        const windowHeight = window.innerHeight;
        const refPosition = this.endOfCardsRef.current.getBoundingClientRect();
        if (refPosition.top < windowHeight) {
            this.isFetchingCards = true;
            this.setState({page: this.state.page + 1});
        }
    }

    handleSearchInput (e) {
        clearTimeout(this.requestTimeout);

        this.endOfSearchResults = false;
        const value = e.target.value;
        
        const newState = {
            page: 1,
            searchTerm: value,
            cards: []
        }

        this.requestTimeout = setTimeout(() => {
            this.setState(newState);
        }, 400)
    }

    buildCards () {
        const { cards, isLoading } = this.state;

        if (cards.length === 0 && isLoading === false) {
            return <div id="no-results-message">
                       <span>No Results</span>
                   </div>
        }

        const cardComponents = cards.map((card) => <Card { ...card } />);
        const endOfCardsRef = <div id="end-of-cards-ref" 
                                key="end-of-cards-ref" 
                                ref={ this.endOfCardsRef } >
                              </div>;
        return (
            <div id="card-canvas">
                { cardComponents.concat(endOfCardsRef) }
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
                { this.state.isLoading &&
                    <div id="loading-message">
                        <span>Loading</span>
                    </div>
                }
            </div>
        )
    }

}

export default GridView;