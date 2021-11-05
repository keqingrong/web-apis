import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';
import { isDesktop } from '../src';
import './index.css';

if (!isDesktop()) {
  import('eruda').then(({ default: eruda }) => {
    eruda.init();
  })
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
