import React, { Component } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';

import docu_logo from './docu_logo.svg';
import wallet from './wallet.svg';

import './Profile.css';

class Profile extends Component {
  state = {
    loading: false,
    user: null,
    username: ''
  };

  componentWillMount() {
    const { auth: { accessToken } } = this.props;
    const { payload: { id } } = jwtDecode(accessToken);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(user => this.setState({ user }))
      .catch(window.alert);
  }

  handleChange = ({ target: { value } }) => {
    this.setState({ username: value });
  };

  handleSubmit = ({ target }) => {
    const { auth: { accessToken } } = this.props;
    const { user, username } = this.state;
    this.setState({ loading: true });
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${user.id}`, {
      body: JSON.stringify({ username }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'PATCH'
    })
      .then(response => response.json())
      .then(user => this.setState({ loading: false, user }))
      .catch(err => {
        window.alert(err);
        this.setState({ loading: false });
      });
  };

  render() {
    const { auth: { accessToken }, onLoggedOut } = this.props;
    const { payload: { publicAddress } } = jwtDecode(accessToken);
    const { loading, user } = this.state;

    const username = user && user.username;

    return (
      <div className="Profile">
        <div className="wallet-header">
            <div className="DocuEditor-header">
              <h1>
                DocuEditor
              </h1>
              <img src={docu_logo} className="DocuEditor-logo" alt="DocuEditor-logo"/>
            </div>
        </div>
        <div className="user">
          <div className="icon">
            <img src={wallet} className="wallet-icon" alt="DocuEditor-logo"/>
            <h2 className="balance" >0.5ETC</h2>
          </div>
          <p>
            Logged in as <Blockies seed={publicAddress} />
          </p>
          <button className="Logout" onClick={onLoggedOut}>Logout</button>
        </div>
      </div>
    );
  }
}

export default Profile;
