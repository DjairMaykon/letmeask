import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createGlobalStyle } from 'styled-components';

import './services/firebase'

import './styles/global.scss'

const GlobalStyles = createGlobalStyle`
  html {
    --color-text-1: #29292e;
    --color-text-2: #f8f8f8;
    --color-text-3: #737380;
    --color-text-4: #a8a8b3;
    --color-background-1:  #f8f8f8;
    --color-background-2:  #fefefe;
    --color-background-3:  #f4f0ff;
    --color-background-4:  #dbdcdd;
    --color-border-1:  #a8a8b3;
    --color-border-2:  #e2e2e2;
    --color-primary:  #3d99af;
    --color-secondary:  #3daf7b;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
); 
