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

  async componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      }
    });

    const userCollection = await db.collection('users').where('name', '==', 'Wade').get();
    this.userCollection = userCollection;
    // console.log(this.userCollection);

    const users = [];
    userCollection.forEach(user => users.push(user.data()));
    // console.log({ ...users[0] });
    this.setState({ ...users[0] }); //eslint-disable-line

    // const ownLists = [];
    // users[0].ownLists.forEach(list => ownLists.push(list));

    // const ownListsPromise = Promise.all(ownLists.map(async (list) => {
    //   console.log('poop');
    //   return list.get();
    //   // const doneList = await list.get();
    //   // return doneList.data();
    // }));
    // // console.log(ownLists);

    // const sharedLists = [];
    // users[0].sharedLists.forEach(list => sharedLists.push(list));

    // const sharedListsPromise = Promise.all(sharedLists.map(async (list) => {
    //   const doneList = await list.get();
    //   return doneList.data();
    // }));

    // Promise.all([ownListsPromise, sharedListsPromise]).then((resolvedLists) => {
    //   const [resolvedOwnLists, resolvedSharedLists] = resolvedLists;
    //   this.setState({
    //     ownLists: resolvedOwnLists,
    //     sharedLists: resolvedSharedLists,
    //   });
    // });
  }

  userCollection = null;

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
