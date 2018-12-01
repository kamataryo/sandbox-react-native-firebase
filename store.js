import { createStore, combineReducers } from 'redux'

import { reducer as authentication } from './reducers/authentication'

export default createStore(
  combineReducers({
    authentication
  })
)
