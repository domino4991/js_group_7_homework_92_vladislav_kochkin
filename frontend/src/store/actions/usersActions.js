import {push} from 'connected-react-router';
import {
    CLEAN_USERS_ERRORS, GET_ACTIVE_USERS_SUCCESS,
    LOGIN_USER_ERROR,
    LOGIN_USER_SUCCESS, LOGOUT_USER_ERROR,
    LOGOUT_USER_SUCCESS,
    REGISTER_USER_ERROR,
    REGISTER_USER_SUCCESS
} from "../actionTypes";
import axiosBase from "../../axiosBase";
import {toast} from "react-toastify";

const loginUserSuccess = data => ({type: LOGIN_USER_SUCCESS, data});
const loginUserError = error => ({type: LOGIN_USER_ERROR, error});

const logoutUserSuccess = () => ({type: LOGOUT_USER_SUCCESS});
const logoutUserError = error => ({type: LOGOUT_USER_ERROR, error});

const registerUserSuccess = () => ({type: REGISTER_USER_SUCCESS});
const registerUserError = error => ({type: REGISTER_USER_ERROR, error});

export const registerUser = data => {
    return async dispatch => {
        try {
            const response = await axiosBase.post('/users', data);
            toast.success(response.data.message);
            dispatch(registerUserSuccess());
            setTimeout(() => {
                dispatch(push('/login'));
            }, 4000);
        } catch (e) {
            if(e.response && e.response.data) {
                dispatch(registerUserError(e.response.data));
            } else {
                dispatch(registerUserError(e.message));
            }
        }
    };
};

export const loginUser = userData => {
    return async dispatch => {
        try {
            const response = await axiosBase.post('/users/sessions', userData);
            dispatch(loginUserSuccess(response.data));
            dispatch(push('/chat'));
        } catch (e) {
            if(e.response && e.response.data) {
                if(!e.response.data.error.errors) {
                    toast.success(e.response.data.error);
                }
                dispatch(loginUserError(e.response.data));
            } else {
                dispatch(loginUserError(e.message));
            }
        }
    }
};

export const logoutUser = () => {
    return async dispatch => {
        try {
            const response = await axiosBase.delete('/users/sessions');
            toast.success(response.data.message);
            dispatch(logoutUserSuccess());
            setTimeout(() => {
                dispatch(push('/'));
            }, 3000);
        } catch (e) {
            if(e.response && e.response.data) {
                dispatch(logoutUserError(e.response.data.error));
            } else {
                dispatch(logoutUserError(e.message));
            }
        }
    };
};

export const getActiveUsers = data => {
    return dispatch => {
        dispatch({type: GET_ACTIVE_USERS_SUCCESS, data});
    }
}

export const cleanUsersErrors = () => {
    return dispatch => {
        dispatch({type: CLEAN_USERS_ERRORS});
    }
}