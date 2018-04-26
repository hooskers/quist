import React, { Component } from 'react';
import { render } from 'react-dom';
import { css } from 'react-emotion';

import List from './components/List/index';
import db, { provider, auth } from './firebase';

const style = css`
  color: blue;
  background-color: green;
`;

// TODO: User's info should be in context provider
class App extends Component {
  state = {
    name: '',
    ownLists: [],
    sharedLists: [],
    user: null,
  };

  componentDidMount() {
    auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const { uid } = authUser;

        const userDoc = await db.collection('users').doc(uid).get();
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
          {this.state.ownLists.map(list => <List key={list.id} listDocument={list} />)}
          {this.state.sharedLists.map(list => <List key={list.id} listDocument={list} />)}
        </div>
        :
        <div>LOADING!!!!</div>
    );
  }
}

render(<App className={style} />, document.getElementById('app'));
