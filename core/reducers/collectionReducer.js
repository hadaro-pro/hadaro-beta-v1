import { COLLECTION_DETAILS_REQUEST, SAVE_COLLECTION_DETAILS, COLLECTION_DETAILS_FAIL } from "../actions/actiontypes";

// const initialState = { 
//   iden: null,
//   colName: '',
//   colSymbol: '',
//   chain: '',
//   colAddress: '',
//   loading: false }



export const collectionDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case COLLECTION_DETAILS_REQUEST:
      return { ...state, loading: true}
    case SAVE_COLLECTION_DETAILS:
      return {...state, collectionInfo: action.payload, loading: false}
      case COLLECTION_DETAILS_FAIL:
        return { loading: false, error: action.payload}
      default:
        return state
  }
}