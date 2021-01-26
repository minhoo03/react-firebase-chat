import {
    SET_USER,
    CLEAR_USER,
    SET_PHOTOURL
} from './types'

// dispatch -> action (객체로 변한 state 표시)
export function setUser(user) {
    return {
        type: SET_USER,
        payload: user
    }
}

export function clearUser() {
    return {
        type: CLEAR_USER
    }
}

export function setPhotoURL(photoRUL) {
    return {
        type: SET_PHOTOURL,
        payload: photoRUL
    }
}