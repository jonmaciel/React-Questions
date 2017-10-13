import * as t from '../actionTypes';
import * as API from '../PostsAPI';

export const addAuthor = author => ({ type: t.ADD_AUTHOR, author});

export const addCategories = categories => ({ type: t.ADD_CATEGORIES, categories});
export const addCommentToCategorie = (postId, path) => ({ type: t.ADD_COMMENT_TO_CATEGORIE, postId, path});
export const addPosts = posts => ({ type: t.ADD_POSTS, posts })

export const createPost = (id, post) => ({ type: t.CREATE_POST, id, post });
export const editPost = (id, post) => ({ type: t.EDIT_POST, id, post });
export const removePost = id => ({ type: t.DELETE_POST, id });
export const thumbsUpPost = (id, scoreQuantity) => ({ type: t.THUMBS_POST, id, scoreQuantity });

export const addComments = comments => ({ type: t.ADD_COMMENTS, comments});
export const createComment = (postId, id, comment) => ({ type: t.CREATE_COMMENT, postId, id, comment });
export const editComment = (id, comment) => ({ type: t.EDIT_COMMENT, id, comment });
export const removeComment = id => ({ type: t.DELETE_COMMENT, id });
export const thumbsUpComment = (id, scoreQuantity) => ({ type: t.THUMBS_COMMENT, id, scoreQuantity });
export const addCommentToPost = (id, commentId) => ({ type: t.ADD_COMMENT_TO_POST, id, commentId});

export const loadAll = () => dispatch =>
  API.getCategories()
    .then(data => {
      dispatch(addCategories(normalizer(data.categories, 'path')))
    }).then(
      API.getPosts()
        .then(posts => dispatch(addPostInCategory(posts)))
    )

export const loadComments = postId => (dispatch, getState) =>
  API.getComments(postId)
    .then(comments => dispatch(normalizeCommentsInPost(comments)))

export const addPostInCategory = posts => (dispatch, getState) => {
  posts.forEach(post =>
    dispatch(addCommentToCategorie(post.id, post.category))
  )
  dispatch(addPosts(normalizer(posts)))
};

export const normalizeCommentsInPost = comments => (dispatch, getState) => {
  Object.values(comments).forEach(comment =>
    dispatch(addCommentToPost(comment.parentId, comment.id))
  )

  dispatch(addComments(normalizer(comments)))
};

export const sendPost = (category, title, body) => (dispatch, getState) =>
  API.postPost(category, title, body, getState().session.author)
    .then(post => {
      dispatch(createPost(post.id, post));
      dispatch(addCommentToCategorie(post.id, post.category))
    });

export const sendEditPost = (id, title, body) => (dispatch, getState) =>
  API.editPost(id, title, body)
    .then(post => dispatch(editPost(id, post)));

export const sendComment = (postId, comment) => (dispatch, getState) =>
  API.postComment(postId, comment, getState().session.author)
    .then(data => {
      dispatch(createComment(postId, data.id, data))
      dispatch(addCommentToPost(postId, data.id))
    });

export const sendEditComment = (id, newComment) => (dispatch, getState) =>
  API.editComment(id, newComment)
    .then(comment => dispatch(editComment(id, comment)));

export const thumbsPost = (id, voteScore) => (dispatch, getState) =>
  API.voteOnPost(id, voteScore).then(data => dispatch(thumbsUpPost(id, voteScore)));

export const thumbsComment = (id, voteScore) => (dispatch, getState) =>
  API.voteOnComment(id, voteScore).then(data => dispatch(thumbsUpComment(id, voteScore)));

export const deleteComment = id => (dispatch, getState) =>
  API.deleteComment(id).then(data => dispatch(removeComment(id)));

export const deletePost = id => (dispatch, getState) =>
  API.deletePost(id).then(data => dispatch(removePost(id)));

const normalizer = (colection, idName = 'id') =>
  colection.reduce((newColection, member) => {
    newColection[member[idName]] = member
    return newColection
  }, {})
