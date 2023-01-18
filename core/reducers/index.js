import { combineReducers } from "redux";
import { collectionDetailsReducer, collectionItemDetailsReducer } from "./collectionReducer";


export default combineReducers({
  collectionDetails: collectionDetailsReducer,
  collectionItemDetails: collectionItemDetailsReducer
})