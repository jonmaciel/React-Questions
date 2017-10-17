import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deletePost, sendPost } from '../actions/';
import Post from './Post';

class Category extends Component {

  state = {
    isWritingPost: false,
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

  render() {
    return (
      <div className="post-body">
        <h2 className="post-body-title">
          {this.props.name}
        </h2>
        <div className="post-body-posts">
          <ol className="posts-grid">
            {this.props.posts && this.props.posts.map((post, i) =>
              <li key={i}>
                <Post
                  categoryPath={this.props.path}
                  deletePost={this.props.deletePost}
                  {...post} />
              </li>
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
    ownProps.postIds.map(postId => state.posts[postId]).filter(post => post && !post.deleted)
});

const mapDispatchToProps = dispatch => ({
  deletePost: postId => dispatch(deletePost(postId)),
  sendPost: (category, title, body) => dispatch(sendPost(category, title, body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);
