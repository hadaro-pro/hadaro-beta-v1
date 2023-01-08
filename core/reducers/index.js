import { combineReducers } from "redux";
import { collectionDetailsReducer } from "./collectionReducer";


export default combineReducers({
  collectionDetails: collectionDetailsReducer
})