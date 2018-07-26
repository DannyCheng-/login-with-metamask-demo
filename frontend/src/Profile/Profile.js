import React, { Component } from 'react';
import Blockies from 'react-blockies';
import jwtDecode from 'jwt-decode';

import docu_logo from './docu_logo.svg';
import wallet from './wallet.svg';
import Web3 from 'web3';
import json from './GetCoin.json';
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
    if (this.state.contract === true) this.GetContract();
  };

  GetContract = () => {
    var web3 = new Web3('http://127.0.0.1:8545');
    var abi = json["abi"];
    var contractAddress = "0xd876b3c72b1f093f77822ee8a3eed2b12ff956f6";
    var contract = web3.eth.contract(abi);
    var contractInstance = contract.at(contractAddress);

    // contractInstance.deposit();

    //contract.methods.getOneCoin(contractAddress).send({from:"******", gas:3000000}).then(
    //);
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
  constructor() {
    super();
    this.state = {
      showClick: true
    }
  }

  create = () => {
    var code = [];

    code.push("<p>contract Transfer {</p>");
    code.push("<p>&nbsp;&nbsp;&nbsp;&nbsp;uint public price;</p>");
    code.push("<p>&nbsp;&nbsp;&nbsp;&nbsp;function Price(uint p) public {</p>");
    code.push("<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;price = p;</p>");
    code.push("<p>&nbsp;&nbsp;&nbsp;&nbsp;}</p>");
    code.push("<p>&nbsp;&nbsp;&nbsp;&nbsp;function f(uint a) public returns(uint) }</p>");
    code.push("<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;uint result = a * 8;</p>");
    code.push("<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return result;</p>");
    code.push("<p>&nbsp;&nbsp;&nbsp;&nbsp;}</p>");
    code.push("<p>}</p>");

    document.getElementById('code').innerHTML = code.join("");
  };

  ShowContract = () => {
    this.setState({showClick: false});
    this.create();
  };

  render() {
    return (
      <div className="contract">
        <p>
          You are almost there! The final step is for both parties (you and Anna) to accept the Smart Contract for this digital agreement. You can accept the Smart Contract we have generated for you, or you can first edit it, then accept it. Once you have accepted the Smart Contract, we will notify Anna and ask her to accept as well.
        </p>
        
        <h3>Smart Contract</h3>
        <div>
          <p>You will pay <span>0.5</span> ETH in this transaction. The transaction will last for 7 days, you can cancel the transaction in first 1 hour from starting time.
          If you are not satisfied with the result, you can request the expert to fine-tune
          The payment is non-refundable</p>
        </div>
        <a id="smartContract" href="#code" onClick={this.ShowContract} style={{display: this.state.showClick ? 'block' : 'none' }}>Click here to view the source contract</a>
        <span id="code"></span>
      </div>
    );
  }
}

export default Profile;
