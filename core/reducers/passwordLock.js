import { SAVE_LAST_PAGE_URL, SAVE_PASSWORD } from "../actions/actiontypes";

export const sitePasswordReducer = (
  state = { savedPassword: null },
  action
) => {
  switch (action.type) {
    case SAVE_PASSWORD:
      return { ...state, savedPassword: action.payload, loading: false };
    default:
      return state;
  }
};

export const lastUrlReducer = (state = { lastUrl: null }, action) => {
  switch (action.type) {
    case SAVE_LAST_PAGE_URL:
      return { ...state, lastUrl: action.payload, loading: false };
    default:
      return state;
  }
};
