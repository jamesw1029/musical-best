import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';

import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import './index.less';
import "bootstrap/dist/js/bootstrap.min";
import 'react-phone-number-input/style.css'
import App from './App';
import store from './store/index';

library.add(far, fas, fab);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root')
);