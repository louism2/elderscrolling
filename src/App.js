import GridView from "./components/GridView";

function App() {

    const style = {
        fontFamily: "sans-serif",
        fontSize: "14px"
    }

    return (
        <div className="App" style={ style }>
            <GridView />
        </div>
    );
}

export default App;
