import { combineReducers } from "redux";
import { collectionDetailsReducer, collectionItemDetailsReducer } from "./collectionReducer";
import { sitePasswordReducer, lastUrlReducer } from "./passwordLock"


export default combineReducers({
  collectionDetails: collectionDetailsReducer,
  collectionItemDetails: collectionItemDetailsReducer,
  sitePassword: sitePasswordReducer,
  lastUrl: lastUrlReducer
})