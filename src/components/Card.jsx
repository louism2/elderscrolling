import "../styles/card.scss";

const Card = ({ imageUrl, name, text, set, type }) => {

    // Pure component
    return (
        <div className="card-wrapper" key={ name }>
            <img src={ imageUrl } />
            <span><b>name:</b> { name }</span>
            <span><b>set:</b> { set.name }</span>
            <span><b>type:</b> { type }</span>
            { text &&
                <span>{ text }</span>
            }
        </div>
    )

}

export default Card;