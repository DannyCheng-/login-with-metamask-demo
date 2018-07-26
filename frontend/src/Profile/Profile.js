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
    username: '',
    contract: false
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

  Continue = () => {
    this.setState({contract: true});
  };

  render() {
    const { auth: { accessToken }, onLoggedOut } = this.props;
    const { payload: { publicAddress } } = jwtDecode(accessToken);
    const { loading, user } = this.state;

    const username = user && user.username;

    return (
      <div className="Profile">
        <div className="content">
            <div className="DocuEditor-header">
              <h1>
                DocuEditor
              </h1>
              <img src={docu_logo} className="DocuEditor-logo" alt="DocuEditor-logo"/>
            </div>
            {this.state.contract ? (
              <SmartContract />
            ) : (
              <DropZoneWrapper />
            )}
            <button className="Continue" onClick={this.Continue}>Continue</button>
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

class DropZone extends Component {
  constructor() {
    super();
    this.state = {
      className: 'drop-zone-hide',
      disableContinue: true
    }
    this._onDragEnter = this._onDragEnter.bind(this);
    this._onDragLeave = this._onDragLeave.bind(this);
    this._onDragOver = this._onDragOver.bind(this);
    this._onDrop = this._onDrop.bind(this);
  }
  
  componentDidMount() {
    window.addEventListener('mouseup', this._onDragLeave);
    window.addEventListener('dragenter', this._onDragEnter);
    window.addEventListener('dragover', this._onDragOver);
    document.getElementById('dragbox').addEventListener('dragleave', this._onDragLeave);
    window.addEventListener('drop', this._onDrop);
  }
  
  componentWillUnmount() {
    window.removeEventListener('mouseup', this._onDragLeave);
    window.removeEventListener('dragenter', this._onDragEnter);
    window.addEventListener('dragover', this._onDragOver);
    document.getElementById('dragbox').removeEventListener('dragleave', this._onDragLeave);
    window.removeEventListener('drop', this._onDrop);
  }
  
  _onDragEnter(e) {
    this.setState({ className: 'drop-zone-show' });
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
  
  _onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  _onDragLeave(e) {
    this.setState({className: 'drop-zone-hide'});
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
  
  _onDrop(e) {
    e.preventDefault();
    let files = e.dataTransfer.files;
    var output = [];
    
    for (let i = 0; i < files.length; i++) {
      let f = files[i];
      if ("JoePlumberResume.docx" === f.name)
      {
        output.push("<p><strong>", escape(f.name), "</strong></p>");
        output.push("<img src='JoePlumberResume.PNG' alt='suggest expert' />");
        break;
      }
      else
      {
        output.push("<p><strong>", escape(f.name), "</strong></p>");
        output.push("<img src='https://media.giphy.com/media/3o6gH2SgFwXHHfsM5q/giphy.gif' alt='suggest expert' />");
        break;
      }
    }
    document.getElementById('list').innerHTML = output.join('');
    // Upload files
    this.setState({className: 'drop-zone-hide'});
    return false;
  }
  
  render() {
    return (
      <div>
        {this.props.children}
        <div id="dragbox" className={this.state.className}>
          Drop a file to Upload
        </div>
      </div>
    );
  }
}

// Use it like so:
class DropZoneWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disableContinue: true
    }
  }

  render() {
    return (
      <DropZone>
        <div className="dragFile">
          <p>
            Thanks! Now we need to find you an expert to help you edit/proofread your document. To get started, please upload your document and we’ll intelligently recommend you an expert.
          </p>
          <h3 className="dragFileH1">Drag A NEW File Here...</h3>
        </div>
        <div id="list"></div>
      </DropZone>
    );
  }
}

class SmartContract extends Component {
  render() {
    return (
      <div className="contract">
        <p>
          You are almost there! The final step is for both parties (you and Anna) to accept the Smart Contract for this digital agreement. You can accept the Smart Contract we have generated for you, or you can first edit it, then accept it. Once you have accepted the Smart Contract, we will notify Anna and ask her to accept as well.
        </p>
        <h3>Smart Contract</h3>
      </div>
    );
  }
}

export default Profile;
