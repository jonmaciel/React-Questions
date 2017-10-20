import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadAll, addAuthor } from '../actions/';
import Category from './Category';
import Post from './Post';
import Login from '../components/Login';
import CategoryList from '../components/CategoryList';
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
              <Route path="/:category/:postId" render={({history, match}) => {
                const showCategory = categories[match.params.category]
                const postId = match.params.postId
                if(!showCategory || !showCategory.postIds.includes(postId)) return <div/>;
                return (
                  <div className="list-posts-content">
                    <Post {...posts[postId]} isShowPage={true} history={history} category={showCategory} />
                  </div>
                )
              }} />
              <Route exact path="/:category" render={({history, match}) =>
                <Category {...this.props.categories[match.params.category]} history={history}/>
              } />
              <Route exact path="/" render={({history}) =>
                <CategoryList categories={this.props.categories}/>
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
