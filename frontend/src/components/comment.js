import React, { Component } from 'react';

class Post extends Component {
  state = {
    isCommentsLoaded: false,
    isPositiveVoted: false,
    isNegativeVoted: false,
    isEditing: false,
    newComment: ''
  };

  handlePositiveVotes = (id, voteScore) => {
    if(this.state.isPositiveVoted) return;
    const sum = this.state.isNegativeVoted ? 2 : 1;

    this.props.thumbsUp(this.props.id, this.props.voteScore + sum)
    this.setState({isPositiveVoted: true,isNegativeVoted: false})
  }

  handleNegativeVotes = (id, voteScore) => {
    if(this.state.isNegativeVoted) return;
    const sum = this.state.isPositiveVoted ? 2 : 1;

    this.props.thumbsUp(this.props.id, this.props.voteScore - sum)
    this.setState({isPositiveVoted: false, isNegativeVoted: true})
  }

  renderReadOnlyComment = () => <div>{this.props.body}</div>

  renderEditComment = () =>
    <div>
      <input value={this.state.newComment} onChange={this.handleChangeNewComment}/>
      <button onClick={this.cancelEdit}>Cancel</button>
      <button onClick={this.handleOnEdit}>Save</button>
    </div>

  cancelEdit = () => this.setState({isEditing: false})

  handleOnEdit = () => {
    this.props.onEdit(this.props.id, this.state.newComment);
    this.cancelEdit();
  }

  handleChangeNewComment = e => this.setState({newComment: e.target.value})

  handleEditing = () => this.setState({
    isEditing: true,
    newComment: this.props.body,
  })

  render() {
    const isEditor = this.props.currentAuthor === this.props.author ;
    return (
      <div className="comment-body">
        <span className="score">Score: {this.props.voteScore}</span>
        { this.state.isEditing ? this.renderEditComment() : this.renderReadOnlyComment()}
        <div>By: {this.props.author}</div>
        { isEditor && <a href="#edit" onClick={this.handleEditing}>edit</a> }
        <br/>
        <div className="thumbs-opts">
          <a href="#thumbs-up" onClick={this.handlePositiveVotes}>I like it!</a>
          <a href="#thumbs-down" onClick={this.handleNegativeVotes}>I don't like it!</a>
          { isEditor && <a href="#delete" onClick={() => this.props.deleteComment(this.props.id)}>delete</a>}
        </div>
      </div>
    )
  }
}

export default Post
