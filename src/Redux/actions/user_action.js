import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from "constants"

import {
    SET_USER,
    CLEAR_USER
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