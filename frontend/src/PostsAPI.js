
const url = `http://localhost:3001`;

let token = localStorage.token
if (!token)
  token = localStorage.token = Math.random().toString(36).substr(-8)

const headers = {
  'Accept': 'application/json',
  'Authorization': token,
  'Content-Type': 'application/json'
}

export const getCategories = () =>
  fetch(`${url}/categories`, { headers })
    .then(res => res.json());

export const getPosts = () =>
  fetch(`${url}/posts`, { headers })
    .then(res => res.json());

export const voteOnPost= (id,voteScore) =>
  fetch(`${url}/posts/${id}`, {
    method: 'PUT', headers,
     body: JSON.stringify({voteScore})
  }).then(res => res.json())


export const getComments = postId =>
  fetch(`${url}/posts/${postId}/comments`, { headers })
    .then(res => res.json());

export const postPost = (category, title, body, author) =>
  fetch(`${url}/posts`, {
    method: 'POST', headers,
    body:  JSON.stringify({
      id: `POST${Date.now()}`,
      timestamp: Date.now(),
      author,
      title,
      body,
      category
    })
  }).then(res => res.json())

export const editPost = (id, title, body) =>
  fetch(`${url}/posts/${id}`, {
    method: 'PUT', headers,
    body:  JSON.stringify({
      title,
      body,
    })
  }).then(res => res.json())

export const postComment = (postId, comment, author) =>
  fetch(`${url}/comments`, {
    method: 'POST', headers,
    body:  JSON.stringify({
      id: `CM${Date.now()}`,
      timestamp: Date.now(),
      author,
      body: comment,
      parentId: postId
    })
  }).then(res => res.json())

export const editComment = (id, comment) =>
  fetch(`${url}/comments/${id}`, {
    method: 'PUT', headers,
    body:  JSON.stringify({
      timestamp: Date.now(),
      body: comment,
    })
  }).then(res => res.json())

export const voteOnComment = (id, voteScore) =>
  fetch(`${url}/comments/${id}`, {
    method: 'PUT', headers,
     body: JSON.stringify({voteScore})
  }).then(res => res.json())

export const deleteComment = (id) =>
  fetch(`${url}/comments/${id}`, { method: 'DELETE', headers })
    .then(res => res.json())

export const deletePost = (id) =>
  fetch(`${url}/posts/${id}`, { method: 'DELETE', headers })
    .then(res => res.json())
