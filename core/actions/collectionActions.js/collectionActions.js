import { COLLECTION_DETAILS_REQUEST, SAVE_COLLECTION_DETAILS, COLLECTION_DETAILS_FAIL } from "../actiontypes";

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