import React, { Component } from 'react';
import ReactDOM from 'react-dom';


class App extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
       <h1>Welcome to OpenSauce!</h1>

       <p>TEST ENDPOINTS:</p>
       <a href="users/rub_duckey/profile">users/rub_duckey/profile</a>
       <br />
       <a href="recipes/rub_duckey">recipes/rub_duckey</a>
      </div>
      
    )
  }
};


export default App;
