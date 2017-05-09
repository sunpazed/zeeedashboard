import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import routes from './common/routes';

import './styles/index.css';

const rootElement = document.getElementById('root');

// --- redux init
import { Provider } from 'react-redux'; 
import store from '~/store/stores'; 

const history = syncHistoryWithStore(browserHistory, store);


ReactDOM.render(
 <Provider store={store}>
    <Router
      routes={routes}
      history={history}>
    </Router>
  </Provider>,
  rootElement
);
