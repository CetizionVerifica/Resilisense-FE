//import 'materialize-css/dist/css/materialize.min.css'

import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import 'antd/dist/antd.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {IntlProvider} from 'react-intl-redux'
//import ApolloClient from 'apollo-client'
import {ApolloProvider} from 'react-apollo'
import {createStore, applyMiddleware} from 'redux'
import reduxThunk from 'redux-thunk'
import bugsnag from 'bugsnag-js'
import createPlugin from 'bugsnag-react'
import reducers from './reducers'
import client from './ApolloClient'
import App from './components/App'
import {AUTH_USER} from './actions/types'

const bugsnagClient = bugsnag('913145ba2ace2ee97c808d36853f2ce8')
bugsnagClient.notifyReleaseStages = ['production', 'staging']
const ErrorBoundary = bugsnagClient.use(createPlugin(React))
//import axios from 'axios'
//window.axios = axios

// Enable the devtools only in dev mode client.
const showDevTools = typeof window !== 'undefined'
  ? (window.devToolsExtension && process.env.NODE_ENV !== 'production')
  : false

const initialState = {
  intl: {
    defaultLocale: 'en',
    locale: 'en',
    messages: {},
  },
  // ...other initialState
}
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore)
const store = createStoreWithMiddleware(reducers,
  initialState, // If you are using the devToolsExtension, you can add it here also
  showDevTools ? window.devToolsExtension() : f => f
)

const token = localStorage.getItem('token') // eslint-disable-line

// if we have token consder user to be siged in
if (token) {
  // we need to update application state
  store.dispatch({type: AUTH_USER})
}

// store.subscribe(state => {
//   console.log("Stae:", state);
// })

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <IntlProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </IntlProvider>
    </Provider>
  </ApolloProvider>
  , document.querySelector('#root')) // eslint-disable-line
