import React, { Component } from 'react';

class ChangePassword extends Component {
  constructor() {
    super();
    this.state = {
      newPassword: ''
    }
  }

  handleOptionInputOnChange = (e) => {
    this.setState({newPassword: e.target.value})
  }

  render() {
    return (
      <form action="/api/updateInfo/password" method="post">
        <div>
          <label for="pwd">Password:</label>
          <input 
            type="text" 
            name="password" 
            value={this.state.newPassword} 
            onChange={this.handleOptionInputOnChange}
          />
        </div>
      </form>
    );
  }
}

export default ChangePassword;