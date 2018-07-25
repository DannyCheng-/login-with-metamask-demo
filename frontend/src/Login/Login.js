import React, { Component } from 'react';
import Web3 from 'web3';

import docu_logo from './docu_logo.svg';
import wallet from './wallet.svg';

import './Login.css';

let web3 = null; // Will hold the web3 instance

class Login extends Component {
  state = {
    loading: false // Loading button state
  };

  handleAuthenticate = ({ publicAddress, signature }) =>
    fetch(`${process.env.REACT_APP_BACKEND_URL}/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json());

  handleClick = () => {
    const { onLoggedIn } = this.props;

    if (!window.web3) {
      window.alert('Please install MetaMask first.');
      return;
    }
    if (!web3) {
      // We don't know window.web3 version, so we use our own instance of web3
      // with provider given by window.web3
      web3 = new Web3(window.web3.currentProvider);
    }
    if (!web3.eth.coinbase) {
      window.alert('Please activate MetaMask first.');
      return;
    }
    const publicAddress = web3.eth.coinbase.toLowerCase();
    this.setState({ loading: true });

    // Look if user with current publicAddress is already present on backend
    fetch(
      `${
        process.env.REACT_APP_BACKEND_URL
      }/users?publicAddress=${publicAddress}`
    )
      .then(response => response.json())
      // If yes, retrieve it. If no, create it.
      .then(
        users => (users.length ? users[0] : this.handleSignup(publicAddress))
      )
      // Popup MetaMask confirmation modal to sign message
      .then(this.handleSignMessage)
      // Send signature to backend on the /auth route
      .then(this.handleAuthenticate)
      // Pass accessToken back to parent component (to save it in localStorage)
      .then(onLoggedIn)
      .catch(err => {
        window.alert(err);
        this.setState({ loading: false });
      });
  };

  handleSignMessage = ({ publicAddress, nonce }) => {
    return new Promise((resolve, reject) =>
      web3.personal.sign(
        web3.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
        publicAddress,
        (err, signature) => {
          if (err) return reject(err);
          return resolve({ publicAddress, signature });
        }
      )
    );
  };

  handleSignup = publicAddress =>
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
      body: JSON.stringify({ publicAddress }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }).then(response => response.json());

  render() {
    const { loading } = this.state;
    return (
      <div>
        <div className="DocuEditor-header">
          <h1>
            DocuEditor
          </h1>
          <img src={docu_logo} className="DocuEditor-logo" alt="DocuEditor-logo"/>
        </div>
        <div className="welcome">
          <p>
            Welcome! Give or receive help on that resume, recommendation letter, personal statement, and thesis soon!​
          </p>
          <p>
            To start using DocuEditor, please deposit some Ether into your Office 365 crypto wallet.
            All digital agreements & transactions are handled on the Ethereum blockchain via smart contracts. ​
          </p>
        </div>
        <div className="Login">
          <img src={wallet} className="wallet" alt="DocuEditor-logo"/>
          <button className="Login-button Login-mm" onClick={this.handleClick}>
            {loading ? 'Loading...' : 'Login with MetaMask'}
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
