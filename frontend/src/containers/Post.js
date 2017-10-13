import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadComments, sendComment, thumbsComment, deleteComment, sendEditPost, sendEditComment } from '../actions/';
import Comment from '../components/comment';

class Post extends Component {
  state = {
    isCommentsLoaded: false,
    isPositiveVoted: false,
    isNegativeVoted: false,
    isEditing: false,
    newPostTitle: '',
    newPostBody: '',
    comment: ''
  };

  handleShowComments = () => {
    this.props.loadComments(this.props.id);
    this.setState({isCommentsLoaded: true})
  }

  handleHideComments = () => {
    this.setState({isCommentsLoaded: false})
  }

  handlePositiveVotes = (id, voteScore) => {
    if(this.state.isPositiveVoted) return;
    let sum = this.state.isNegativeVoted ? 2 : 1;

    this.props.thumbsPost(this.props.id, this.props.voteScore + sum)
    this.setState({isPositiveVoted: true,isNegativeVoted: false})
  }

  handleNegativeVotes = (id, voteScore) => {
    if(this.state.isNegativeVoted) return;
    let sum = this.state.isPositiveVoted ? 2 : 1;

    this.props.thumbsPost(this.props.id, this.props.voteScore - sum)
    this.setState({isPositiveVoted: false, isNegativeVoted: true})
  }

  handleChange = (e) => this.setState({ comment: e.target.value });

  handleKeyPress = (e) => e.key === 'Enter' && this.sendComment();

  sendComment = () => {
    const coment = this.state.comment;
    if(!coment.length) return;

    this.setState({ comment: '' });
    this.props.sendComment(this.props.id, coment)
  }

  renderReadOnlyPost = () => {
    const {id, title, body, author} = this.props
    const isWrittenByCurrentlyauthor = this.props.currentAuthor === author;

    return(
      <div>
        <h4 className="post-body-title">{title}</h4>
        <div>
          <div>{body}</div>
          <span>By: {author}</span>
          <div>
          { isWrittenByCurrentlyauthor && <a href="#edit" onClick={this.handleEdit}>Edit..</a>}
          </div>
        </div>
        <br />
        <div className="thumbs-opts">
          <a href="#thumbs-up" onClick={this.handlePositiveVotes}>I like it!</a>
          <a href="#thumbs-down" onClick={this.handleNegativeVotes}>I don't like it!</a>
          { isWrittenByCurrentlyauthor &&
            <a href="#delete" onClick={() => this.props.deletePost(id)}>delete</a>
          }
        </div>
      </div>
    )
  }

  renderEditOnlyPost = () => {
    return(
      <div>
        <div>
          <input value={this.state.newPostTitle} onChange={this.handleChangeNewPostTitle}/>
        </div>
        <div>
          <textarea value={this.state.newPostBody} onChange={this.handleChangeNewPostBody}/>
        </div>
        <button onClick={this.handleCancelEdit}>Cancel</button>
        <button onClick={this.handleSendEditPost}>Save</button>
      </div>
    )
  }


  handleSendEditPost = () => {
    this.props.sendEditPost(this.props.id, this.state.newPostTitle ,this.state.newPostBody)
    this.handleCancelEdit();
  }

  handleChangeNewPostTitle = e => this.setState({newPostTitle: e.target.value})
  handleChangeNewPostBody = e => this.setState({newPostBody: e.target.value})
  handleCancelEdit = () => this.setState({isEditing: false})

  handleEdit = () => {
    this.setState({
      isEditing: true,
      newPostTitle: this.props.title,
      newPostBody: this.props.body,
    })
  }

  render() {
    return (
      <div className="post">
        <span className="score">Score: {this.props.voteScore}</span>
        {this.state.isEditing ? this.renderEditOnlyPost() : this.renderReadOnlyPost()}
        <h5>Comments</h5>
        { this.state.isCommentsLoaded ?
          <div>
            <a href="#show-comments" onClick={this.handleHideComments}>
              Hide Comments
            </a>
            <div>
              {
                this.props.comments().map((comment, key) =>
                  <Comment
                    key={key}
                    currentAuthor={this.props.currentAuthor}
                    thumbsUp={this.props.thumbsComment}
                    deleteComment={this.props.deleteComment}
                    onEdit={this.props.sendEditComment}
                    {...comment}
                  />
                )
              }
            </div>
            <div>
              <div>
                New comment
              </div>
              <input
                onChange={this.handleChange}
                type="text"
                value={this.state.comment}
                onKeyPress={this.handleKeyPress}
              />
              <button onClick={this.sendComment}>GO!</button>
            </div>
          </div> :
          <a href="#show-comments" onClick={this.handleShowComments}>
            Show Comments
          </a>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
 currentAuthor: state.session.author,
 comments: () => {
    const comments = state.comments
    if(!ownProps.commentIds || !Object.keys(comments).length) return [];

    return ownProps.commentIds.map(
      commentId => comments[commentId] || []
    ).filter(comment => !comment.deleted)
  }
});

const mapDispatchToProps = dispatch => ({
  loadComments: postId => dispatch(loadComments(postId)),
  sendComment: (postId, comment) => dispatch(sendComment(postId, comment)),
  sendEditPost: (id, title, body) => dispatch(sendEditPost(id, title, body)),
  sendEditComment: (id, comment) => dispatch(sendEditComment(id, comment)),
  thumbsComment: (commentID, voteScore) => dispatch(thumbsComment(commentID, voteScore)),
  deleteComment: commentID => dispatch(deleteComment(commentID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
