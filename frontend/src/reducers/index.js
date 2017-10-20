import { combineReducers } from 'redux';
import * as t from '../actionTypes';

const session = (state = {author: undefined}, action) => {
  const { author } = action;

  switch (action.type) {
    case t.ADD_AUTHOR: {
      return {...state, author }
    }

    default:
      return state;
  }
}

const categories = (state = {}, action) => {
  const { path, categories, postId } = action

  switch (action.type) {

    case t.ADD_CATEGORIES: {
      return {...categories}
    }

    case t.ADD_COMMENT_TO_CATEGORIE: {
      const newCategories = {...state}
      if(!path || !newCategories[path]) return newCategories;

      if(newCategories[path].postIds) {
        newCategories[path].postIds = [...newCategories[path].postIds].concat(postId)
      } else {
        newCategories[path].postIds = [postId]
      }

      return {...newCategories}
    }

    default:
      return state;
  }
}

const posts = (state = {}, action) => {
  const { id, post, scoreQuantity, posts, commentId} = action

  switch (action.type) {

    case t.ADD_POSTS: {
      return {...state, ...posts}
    }

    case t.CREATE_POST: {
      return {...state, [id]: {...post, commentIds: []}}
    }

    case t.ADD_COMMENT_TO_POST: {
      const newPosts = {...state}

      if(newPosts[id].commentIds) {
        newPosts[id].commentIds = [...newPosts[id].commentIds, commentId]
      } else {
        newPosts[id].commentIds = [commentId]
      }

      return {...newPosts}
    }

    case t.EDIT_POST: {
      const newPosts = {...state}
      newPosts[id] = post

      return {...state, ...newPosts}
    }

    case t.DELETE_POST: {
      let newPosts = {...state}
      newPosts[id].deleted = true
      return {...state, ...newPosts}
    }

    case t.THUMBS_POST: {
      const newPosts = {...state}
      newPosts[id].voteScore = scoreQuantity

      return {...state, ...newPosts}
    }

    default:
      return state;
  }
};

const comments = (state = {}, action) => {
  const { id, comment, scoreQuantity, comments } = action

  switch (action.type) {
    case t.ADD_COMMENTS: {
      return {...state, ...comments}
    }

    case t.CREATE_COMMENT: {
      return {...state, [id]: comment}
    }

    case t.EDIT_COMMENT: {
      const newComments = {...state}
      newComments[id] = comment

      return {...state, ...newComments}
    }


    case t.DELETE_COMMENT: {
      let comments = {...state}
      comments[id].deleted = true

      return comments;
    }

    case t.THUMBS_COMMENT: {
      let comments = {...state}
      comments[id].voteScore = scoreQuantity

      return {...state, ...comments}
    }

    default:
      return state;
  }
};

export default combineReducers({ session, categories, posts, comments });
