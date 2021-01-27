import {
    SET_CURRENT_CHAT_ROOM
} from '../actions/types'

const initialChatRoomrState = {
    currentChatRoom: null // 처음엔 null => room 선택시 파라미터로 넘어온 room이 redux에 저장
}

// action의 type 확인 -> 바뀐 값, 로딩 끝 반환
export default function(state = initialChatRoomrState, action ) {
    switch(action.type) {

        case SET_CURRENT_CHAT_ROOM: 
            return {
                ...state,
                currentChatRoom: action.payload
            }

        default:
            return state
    }
}