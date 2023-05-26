import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { composeWithDevTools } from 'redux-devtools-extension'
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import rootReducer from './reducers';

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ['collectionDetails', 'collectionItemDetails', 'sitePassword', 'lastUrl']
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));

let persistor = persistStore(store);

export { persistor, store };