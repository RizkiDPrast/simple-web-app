import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Simple User Management</h2>          
        </div>
        <div className="App-intro" style={{marginTop: "12px"}}>
          <Register />
        </div>
      </div>
    );
  }
}

export default App;
