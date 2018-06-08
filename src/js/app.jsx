import React, { Component } from 'react';
import { render } from 'react-dom';
import { css } from 'react-emotion';
// import { Router } from '@reach/router';
import database, { provider, auth } from './firebase';

import UserContext from './components/UserContext';
import ListGallery from './components/ListGallery';

const style = css`
  color: blue;
  background-color: green;
`;

class App extends Component {
  state = {
    name: '',
    user: null,
  };

  componentDidMount() {
    auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const { uid } = authUser;

        const userDoc = await database.collection('users').doc(uid).get();
        const userData = userDoc.data();

        this.setState({ user: authUser, ...userData }); //eslint-disable-line
      }
    });
  }

  login = () => {
    auth.signInWithPopup(provider)
      .then((result) => {
        this.setState({ user: result.user });
      });
  }

  logout = () => {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null,
        });
      });
  }

  render() {
    if (!this.state.user) {
      return (
        <button onClick={this.login}>login</button>
      );
    }

    return (
      this.state.name ?
        <div>
          <button onClick={this.logout}>logout</button>
          <span>Name: {this.state.name}</span>
          <UserContext.Provider value={this.state.user.uid}>
            <ListGallery />
          </UserContext.Provider>
        </div>
        :
        <div>LOADING!!!!</div>
    );
  }
}

render(<App className={style} />, document.getElementById('app'));
