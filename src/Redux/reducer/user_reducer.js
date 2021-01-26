import {
    SET_USER,
    CLEAR_USER,
    SET_PHOTOURL
} from '../actions/types'

const initialUserState = {
    currentUser: null, // 이 property에 유저 정보(user)에 담을 것
    isLoading: true
}

// action의 type 확인 -> 바뀐 값, 로딩 끝 반환
export default function(state = initialUserState, action ) {
    switch(action.type) {
        case SET_USER:
        return {
            ...state,
            currentUser: action.payload,
            isLoading: false
        }

        case CLEAR_USER:
            return {
                // 객체 형식, action.type을 확인해보고 clear_user일시 state = null
                ...state,
                currentUser: null,
                isLoading: false
            }

            // action.payload = photoURL
        case SET_PHOTOURL:
            return {
                ...state,
                currentUser: {...state.currentUser, photoURL: action.payload},
                isLoading: false
            }
        default:
            return state
    }
}