import React, { Component } from 'react';

class Category extends Component {
  state = {
    name: ''
  };

  handleChange = e => this.setState({ name: e.target.value });
  handleOnLogin = () => this.props.onLogin(this.state.name);

  render() {
    return (
      <div className="post-body">
        <h2 className="post-body-title">
          Let me know who are you! :D
        </h2>
        <div className="post-body-posts">
          <input placeholder="Your name here..." value={this.state.name} onChange={this.handleChange}/>
          <button href="#login" onClick={this.handleOnLogin}>Go!</button>
        </div>
      </div>
    );
  }
}

export default Category;
