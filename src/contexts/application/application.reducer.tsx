"use client";

type Action =
  | { type: "SET_USER_PERMISSION"; payload: any }
  | { type: "SET_APP"; payload: any }
  | { type: "SET_PLATFORM"; payload: any }
  | { type: "SET_USER_PARAMS"; payload: any }
  | { type: "SET_HEADER_VISIBLE"; payload: boolean };

export interface State {
  user_permissions: any;
  app: any;
  user?: any;
  business?: any;
  platform?: any;
  headerVisible: boolean;
  app_config?: any;
  check_in?: any;
  config: any;
  wallet: any;
}

export const initialState: State = {
  user_permissions: [],
  app: null,
  user: null,
  business: null,
  headerVisible: false,
  app_config: null,
  check_in: null,
  config: null,
  wallet: null,
};

export function applicationReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_USER_PERMISSION": {
      return {
        ...state,
        user_permissions: action.payload,
      };
    }
    case "SET_APP": {
      return {
        ...state,
        app: action.payload,
      };
    }
    case "SET_PLATFORM": {
      return {
        ...state,
        platform: action.payload,
      };
    }
    case "SET_USER_PARAMS": {
      return {
        ...state,
        user: action.payload.user,
        business: action.payload.business,
        app_config: action.payload.app_config,
        check_in: action.payload.check_in,
        config: action.payload.config,
        wallet: action.payload.wallet,
      };
    }
    case "SET_HEADER_VISIBLE": {
      return {
        ...state,
        headerVisible: action.payload,
      };
    }
    default:
      return state;
  }
}
