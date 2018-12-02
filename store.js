import { createStore, combineReducers } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { reducer as authentication } from './reducers/authentication'

const persistConfig = {
  key: 'root',
  storage
}

const rootReducer = combineReducers({
  authentication
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)
