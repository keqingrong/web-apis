import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';
import { isDesktop } from '../src';
import eruda from 'eruda';
import './index.css';

if (!isDesktop()) {
  eruda.init();
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
