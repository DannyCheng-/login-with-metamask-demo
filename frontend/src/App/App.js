import React, { Component } from 'react';

import Login from '../Login';
import logo from './logo.svg';
import Profile from '../Profile/Profile';
import './App.css';
import './fabric.css';

const LS_KEY = 'mm-login-demo:auth';

class App extends Component {
  componentWillMount() {
    // Access token is stored in localstorage
    const auth = JSON.parse(localStorage.getItem(LS_KEY));
    this.setState({
      auth
    });
  }

  handleLoggedIn = auth => {
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
    this.setState({ auth });
  };

  handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    this.setState({ auth: undefined });
  };

  renderNavLinks() {
    let navLinks = [];

    navLinks.push(
      <li id="header-install-office-link" className="header-item" key="header-install-office-link">
        <a
          className="header-link"
          target="_self"
        >
          Install Office
        </a>
      </li>,
    );

    navLinks.push(
      <li id="header-share-office-link" className="header-item" key="header-share-office-link">
        <a
          className="header-link"
          target="_self"
        >
          Share Office
        </a>
      </li>,
    );

    return navLinks;
  }

  render() {
    const { auth } = this.state;
    return (
      <div>
        <div id="category-header" className="category-header" role="navigation">
          <section className="grid">
            <ul>
              <li className="header-item">
                <a
                  role="button"
                  className="header-link waffle-link"
                  id={this.waffleId}
                  href="javascript:void(0)"
                >
                  <i className="ms-Icon ms-Icon--Waffle waffle-icon" />
                </a>
              </li>
              <li className="header-item">
                <a className={`header-link officeLogo-link "officeLogo-link-nowaffle"}`}>
                  <i className="ms-Icon ms-Icon--OfficeLogo officeLogo-icon" /><span>Office</span>
                </a>
              </li>
              {this.renderNavLinks()}
            </ul>
          </section>
        </div>
        <div className="App App-intro">
          {auth ? (
            <Profile auth={auth} onLoggedOut={this.handleLoggedOut} />
          ) : (
            <Login onLoggedIn={this.handleLoggedIn} />
          )}
        </div>
      </div>
    );
  }
}

export default App;
