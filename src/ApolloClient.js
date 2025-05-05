import {ApolloClient, HttpLink, InMemoryCache} from 'apollo-client-preset'
//import { ApolloClient } from 'apollo-client';

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
};

const link = new HttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
})
const cache = new InMemoryCache({
  dataIdFromObject: o => o.id,
  addTypename: true,
  cacheResolvers: {},
})
const client = new ApolloClient({
  link,
  // use restore on the cache instead of initialState
  cache: cache.restore(window.__APOLLO_CLIENT__), // eslint-disable-line
  ssrMode: true,
  ssrForceFetchDelay: 100,
  connectToDevTools: true,
  queryDeduplication: true,
  dataIdFromObject: o => o.id,
  defaultOptions: defaultOptions,  
})





/*
const entityMiddleware = (client) => {
  return ({getState, dispatch}) => {
    const {entity} = getState().auth
    client.networkInterface._uri = `${config.backendUrl[entity]}/graphql`
    return next => action => {
      if (action.type === AUTH_CLIENT && action.entity) {
        client.networkInterface._uri = `${config.backendUrl[action.entity]}/graphql`
        console.log('>>> onLogin!');
        onLogin()
      }
      if (action.type === UNAUTH_CLIENT) {
        client.networkInterface._uri = ''
        setupLoginPromise()
      }
      if (action.type === REHYDRATE && get(action, 'payload.auth.entity')) {
        client.networkInterface._uri = `${config.backendUrl[action.payload.auth.entity]}/graphql`
        onLogin()
      }
      return next(action)
    }
  }
}


const cookieMiddleware = ({getState, dispatch}) => {
  return next => action => {
    if (action.type === REHYDRATE && get(action, 'payload.auth.authtoken')) {
      if (/authtoken=([^;]+);/.test(action.payload.auth.authtoken)) {
        action.payload.auth.authtoken = action.payload.auth.authtoken.match(/authtoken=([^;]+);/)[1]
      }
      setAuthCookie(action.payload.auth.authtoken).then(() => next(action))
    } else {
      return next(action)
    }
  }
}
*/
export default client
