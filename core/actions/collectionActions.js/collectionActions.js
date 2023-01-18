import { COLLECTION_DETAILS_REQUEST, SAVE_COLLECTION_DETAILS, COLLECTION_DETAILS_FAIL, SAVE_ITEM_DETAILS } from "../actiontypes";

/**
 * saves the collection details
 * @param  payload object
 * @returns dispatch
 */

export const saveCollectionDetails = (collectionObj) => (dispatch) => {

  dispatch({ type: COLLECTION_DETAILS_REQUEST })

  if(collectionObj === null) {
    dispatch({ type: COLLECTION_DETAILS_FAIL })
  }

  dispatch({ type: SAVE_COLLECTION_DETAILS, payload: collectionObj})

}


export const saveCollectionItemDetails = (collectionArr) => (dispatch) => {

 

  dispatch({ type: SAVE_ITEM_DETAILS, payload: collectionArr})

}