import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendPost, loadComments } from '../actions/';
import { Link } from 'react-router-dom'
import Post from './Post'

class Category extends Component {
  state = {
    isWritingPost: false,
    order: 'id',
  }

  toggleWritingPost = () =>
    this.setState({
      isWritingPost: !this.state.isWritingPost,
      newPostTitle: '',
      newPostBody: '',
    })

  onNewPostTitleChange = e =>
    this.setState({newPostTitle: e.target.value});

  onNewPostBodyChange = e =>
    this.setState({newPostBody: e.target.value});

  handleSendPost = () => {
    this.props.sendPost(this.props.path, this.state.newPostTitle, this.state.newPostBody)
    this.toggleWritingPost();
  }

  ordererdPosts = () => {
    const posts = this.props.posts;
    const order = this.state.order;
    if(!posts) return [];
    if(order === 'id') return posts;

    return posts.map(post => post[order]).sort(function(a,b){return a - b})
      .map(orderAttr => posts.filter(post => post[order] === orderAttr)[0])
  }

  render() {
    return (
      <div className="post-body">
        <h2 className="post-body-title">
          {this.props.name}
        </h2>
        <Link to="/" >
          Back to categories list
        </Link>
        <div className="thumbs-opts">
          <a href="#sort-date" onClick={() => this.setState({order: 'timestamp'})}>Sort by Date</a>
          <a href="#sort-score" onClick={() => this.setState({order: 'voteScore'})}>Sort by Score</a>
        </div>
        <div className="post-body-posts">
          <ol className="posts-grid">
            {this.ordererdPosts().map((post, i) => {
              return (
                <li key={i}>
                  <div className="post-body">
                    <Link key={post.id} to={`/${this.props.path}/${post.id}`}>
                      SHOW DETAILS
                    </Link>
                    <Post {...post} history={this.props.history} category={this.props} />
                  </div>
                </li>
              )
            }
            )}
          </ol>
        </div>
        <div>
          <a href="#new-post" onClick={this.toggleWritingPost}>
            {this.state.isWritingPost ? 'Cancel new post' : 'New Post'}
          </a>
          {
            this.state.isWritingPost &&
            <div>
              <div>
                <input
                  placeholder="Title"
                  value={this.state.newPostTitle}
                  onChange={this.onNewPostTitleChange}
                />
              </div>
              <div>
                <textarea
                  placeholder="Your post here..."
                  value={this.state.newPostBody}
                  onChange={this.onNewPostBodyChange}
                />
              </div>
              <button href="#post" onClick={this.handleSendPost}>Post!</button>
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  posts: ownProps.postIds &&
    ownProps.postIds.map(postId => state.posts[postId]).filter(post => post && !post.deleted),
});

const mapDispatchToProps = dispatch => ({
  sendPost: (category, title, body) => dispatch(sendPost(category, title, body)),
  loadComments: postId => dispatch(loadComments(postId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);
