import { SAVE_LAST_PAGE_URL, SAVE_PASSWORD } from "../actiontypes";

/**
 * saves the site password
 * @param  payload password
 * @returns dispatch
 */

export const savePassword = (password) => (dispatch) => {
  dispatch({ type: SAVE_PASSWORD, payload: password });
};

/**
 * saves the last page url
 * @param  payload pageUrl
 * @returns dispatch
 */
export const saveLastPageUrl = (pageUrl) => (dispatch) => {
  dispatch({ type: SAVE_LAST_PAGE_URL, payload: pageUrl });
};
