import React,{Component} from 'react';

import {render} from 'react-dom';

class App extends Component{
    render(){
        return(
            <h1>Holaaaa puta</h1>
        )
    }
}

render(<App></App>,document.getElementById('app'));