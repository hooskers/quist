import React, { Component } from 'react';
import { render } from 'react-dom';
import { css } from 'react-emotion';
import database, { provider, auth } from './firebase';

import List from './components/List/index';
import Firestore from './components/Firestore/index';

const DBContext = React.createContext(database);

const style = css`
  color: blue;
  background-color: green;
`;

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
      <DBContext.Provider value={database}>
        {this.state.name ?
          <div>
            <button onClick={this.logout}>logout</button>
            <span>Name: {this.state.name}</span>
            {this.state.ownLists.map(list => (
              <DBContext.Consumer key={list.id}>
                {db => (
                  <Firestore listDocRef={list} database={db}>
                    {(listData, runTransaction) => (
                      <List
                        items={listData.items}
                        name={listData.name}
                        onAddItem={runTransaction}
                        onDeleteItem={runTransaction}
                      />
                    )}
                  </Firestore>
                )}
              </DBContext.Consumer>))}
            {this.state.sharedLists.map(list => <List key={list.id} listDocument={list} />)}
          </div>
          :
          <div>LOADING!!!!</div>}
      </DBContext.Provider>
    );
  }
}

render(<App className={style} />, document.getElementById('app'));
