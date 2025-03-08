// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the change here for React 18
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

// Create a root.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Initial render: Render the App component wrapped in the Provider.
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);