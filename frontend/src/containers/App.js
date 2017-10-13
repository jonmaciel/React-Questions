import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadAll, addAuthor } from '../actions/';
import Category from './Category';
import Login from '../components/Login';
import { Route } from 'react-router-dom'
import '../App.css';

class App extends Component {
  componentDidMount() {
    this.props.loadAll();
  }

  onLogin = (name) => {
    if(!name.length) return;
    this.props.addAuthor(name)
  }

  render() {
    const { currentAuthor } = this.props;
    return (
      <div className="App">
        <div className="list-posts-content">
          <div className="list-posts-title">
            <h1>Questions</h1>
            <span>{currentAuthor.length ? `Author: ${currentAuthor}` : '' } </span>
          </div>
          <Route exact path="/" render={({history}) =>
            <div className="list-posts-content">
              { !currentAuthor.length ?
                history.push('/login') :
                Object.values(this.props.categories).map(category =>
                <Category key={category.path} {...category}/>
              )}
            </div>
          } />
          <Route path="/login" render={({history}) =>
            <Login onLogin={name => {
                this.onLogin(name);
                history.push('/')
              }}
            />}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentAuthor: state.session.author || '',
  categories: state.categories
});

const mapDispatchToProps = dispatch => ({
  loadAll: () => dispatch(loadAll()),
  addAuthor: author => dispatch(addAuthor(author))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
