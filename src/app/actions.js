import { CALL_API } from './middleware/api'

// There are three possible states for our login
// process and we need actions for each of them
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const QUOTE_REQUEST = 'QUOTE_REQUEST'
export const QUOTE_SUCCESS = 'QUOTE_SUCCESS'
export const QUOTE_FAILURE = 'QUOTE_FAILURE'
export const SHOW_LOCK = 'SHOW_LOCK'
export const LOCK_SUCCESS = 'LOCK_SUCCESS'
export const LOCK_ERROR = 'LOCK_ERROR'

function showLock() {
    return {
        type: SHOW_LOCK
    }
}

function lockSuccess(profile, token) {
    return {
        type: LOCK_SUCCESS,
        profile,
        token
    }
}

function lockError(err) {
    return {
        type: LOCK_ERROR,
        err
    }
}

function requestLogin(creds) {
    return {
        type: LOGIN_REQUEST,
        isFetching: true,
        isAuthenticated: false,
        creds
    }
}

function receiveLogin(user) {
    return {
        type: LOGIN_SUCCESS,
        isFetching: false,
        isAuthenticated: true,
        id_token: user.id_token
    }
}

function requestLogout() {
    return {
        type: LOGOUT_REQUEST,
        isFetching: true,
        isAuthenticated: false
    }
}

function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
        isFetching: false,
        isAuthenticated: false
    }
}

function loginError(message) {
    return {
        type: LOGIN_FAILURE,
        isFetching: false,
        isAuthenticated: false,
        message
    }
}

// Calls the API to get a token and
// dispatches actions along the way
export function loginUser(creds) {

    let config = {
        method: 'POST',
        headers: { 'Content-Type':'application/x-www-form-urlencoded' },
        body: `username=${creds.username}&password=${creds.password}`
    }

    return dispatch => {
        // We dispatch requestLogin to kickoff the call to the API
        dispatch(requestLogin(creds))

        return fetch('/sessions/create', config)
            .then(response =>
                response.json().then(user => ({ user, response }))
            ).then(({ user, response }) =>  {
                if (response.ok) {
                    // If login was successful, set the token in local storage
                    localStorage.setItem('id_token', user.id_token)
                    localStorage.setItem('access_token', user.access_token)
                    // Dispatch the success action
                    dispatch(receiveLogin(user))
                } else {
                    // If there was a problem, we want to
                    // dispatch the error condition
                    dispatch(loginError(user.message))
                    return Promise.reject(user)
                }
            }).catch(err => console.log("Error: ", err))
    }
}


// Logs the user out
export function logoutUser() {
    return dispatch => {
        dispatch(requestLogout())
        localStorage.removeItem('id_token')
        localStorage.removeItem('access_token')
        dispatch(receiveLogout())
    }
}

// Uses the API middlware to get a quote
export function fetchQuote() {
    return {
        [CALL_API]: {
            endpoint: 'random-quote',
            types: [QUOTE_REQUEST, QUOTE_SUCCESS, QUOTE_FAILURE]
        }
    }
}

// Same API middlware is used to get a
// secret quote, but we set authenticated
// to true so that the auth header is sent
export function fetchSecretQuote() {
    return {
        [CALL_API]: {
            endpoint: 'protected/random-quote',
            authenticated: true,
            types: [QUOTE_REQUEST, QUOTE_SUCCESS, QUOTE_FAILURE]
        }
    }
}

export function login() {
    // display lock widget
    return dispatch => {
        lock.show();
    }
}

let lock;
// Listen to authenticated event and get the profile of the user
export function doAuthentication() {
    return dispatch => {
        lock.on('authenticated', function(authResult) {
            lock.getProfile(authResult.idToken, function(error, profile) {

                if (error) {
                    // handle error
                    return dispatch(lockError(error))
                }

                localStorage.setItem('profile', JSON.stringify(profile))
                localStorage.setItem('id_token', authResult.idToken)
                return dispatch(lockSuccess(profile))
            });
        });
    }
}
