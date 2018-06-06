import React, { Component } from 'react';
import Connect from 'uport-connect'
import { Credentials, SimpleSigner } from 'uport'
import { crypto } from 'uport-core'

import './App.css';

const CHASQUI_URL = 'https://chasqui.uport.me/api/v1/topic/'

// Demo app
var config = {
  did: '2oeXufHGDpU51bfKBsZDdu7Je9weJ3r7sVG',
  privateKey: 'c818c2665a8023102e430ef3b442f1915ed8dc3abcaffbc51c5394f03fc609e2'
}

const credentials = new Credentials({
  did: config.did,
  signer: SimpleSigner(config.privateKey)
})

var connect = new Connect('Demo')

class App extends Component {
  
  constructor(props) {
    super(props)
    connect.onResponse('signVerification').then(payload => {
      console.log(payload)
    })
    connect.onResponse('login').then(payload => {
      console.log(payload)
    })
  }

  handleLogin() {
    credentials.requestDisclosure({
      requested: ['avatar', 'name'],
      notifications: true,
      callbackUrl: CHASQUI_URL + crypto.randomString(16),
    }).then(requestToken => {
      connect.request(requestToken, 'login')
    })
    
  }

  handleClick() {
    credentials.createVerificationRequest(
      { name: 'Bob' }, // Claim
      '2or9w8Z9EfEJ4FUt1VarhEJCqz7tXsLhbcE' // Subject (did format?)
    )
    .then(requestToken => {
      console.log(requestToken)
      connect.request('signVerification', requestToken)
    })
    
  }
  render() {
    return (
      <div className="App">
        <button onClick={this.handleLogin.bind(this)}>Login</button>
        <button onClick={this.handleClick.bind(this)}>Request to sign a claim</button>
      </div>
    );
  }
}

export default App;
