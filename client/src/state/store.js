import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

const store = createStore( 
    reducers,
    {},
    applyMiddleware(thunk) // ora si può fare ke chiamate asincrone 
);

export default store