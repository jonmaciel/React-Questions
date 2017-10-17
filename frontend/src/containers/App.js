import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadAll, addAuthor } from '../actions/';
import Category from './Category';
import Post from './Post';
import Login from '../components/Login';
import { Route, withRouter } from 'react-router-dom'
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
    const { currentAuthor, categories, posts } = this.props;

    return (
      <div className="App">
        <div className="list-posts-content">
          <div className="list-posts-title">
            <h1>Questions</h1>
            <span>{currentAuthor.length ? `Author: ${currentAuthor}` : '' } </span>
          </div>
          {
            currentAuthor.length ?
            <div>
              <Route path="/:category/:postId" render={({match}) => {
               const showCategory = categories[match.params.category]
               const postId = match.params.postId
               if(!showCategory || !showCategory.postIds.includes(postId)) return <div/>;
               return  <div>
                  <h2>{showCategory.name}</h2>
                  <Post {...posts[postId]} isShowPage={true} />
                </div>
              }
              } />
              <Route exact path="/" render={() =>
                <div className="list-posts-content">
                { Object.values(this.props.categories).map(category => <Category key={category.path} {...category}/> )}
                </div>
              } />
            </div> :
            <Login onLogin={(name) => {this.onLogin(name)}} />
          }
        </div>
      </div>

    );
  }
}

const mapStateToProps = state => ({
  currentAuthor: state.session.author || '',
  categories: state.categories || {},
  posts: state.posts || {}
});

const mapDispatchToProps = dispatch => ({
  loadAll: () => dispatch(loadAll()),
  addAuthor: author => dispatch(addAuthor(author))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
