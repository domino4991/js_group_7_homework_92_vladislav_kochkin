import {
    CLEAN_USERS_ERRORS, GET_ACTIVE_USERS_SUCCESS,
    LOGIN_USER_ERROR,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER_ERROR, LOGOUT_USER_SUCCESS,
    REGISTER_USER_ERROR,
    REGISTER_USER_SUCCESS
} from "../actionTypes";

const initialState = {
    users: null,
    user: null,
    usersError: null
};

export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ACTIVE_USERS_SUCCESS:
            return {
                ...state,
                users: action.data
            };
        case LOGIN_USER_SUCCESS:
            return {
                ...state,
                user: action.data,
                usersError: null
            };
        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                usersError: null
            };
        case REGISTER_USER_ERROR:
        case LOGIN_USER_ERROR:
        case LOGOUT_USER_ERROR:
            return {
                ...state,
                usersError: action.error
            };
        case LOGOUT_USER_SUCCESS:
            return {
                ...state,
                user: null,
                usersError: null
            };
        case CLEAN_USERS_ERRORS:
            return {
                ...state,
                usersError: null
            };
        default:
            return state;
    }
};