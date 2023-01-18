import { COLLECTION_DETAILS_REQUEST, SAVE_COLLECTION_DETAILS, COLLECTION_DETAILS_FAIL, SAVE_ITEM_DETAILS } from "../actions/actiontypes";

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

export const collectionItemDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case SAVE_ITEM_DETAILS:
      return {...state, itemsArr: action.payload, loading: false}
      default:
        return state
  }
}