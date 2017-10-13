import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers/';

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
  const { createLogger } = require(`redux-logger`);
  const logger = createLogger({ collapsed: true, duration: true });
  middlewares.push(logger);
}

export default createStore(reducer, composeWithDevTools(applyMiddleware(...middlewares)));
