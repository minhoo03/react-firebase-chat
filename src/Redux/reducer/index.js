// reducer 합치기
import { combineReducers } from 'redux'
import user from './user_reducer'
import chatRoom from './chatRoom_reducer'

// dispatch -> action -> reducer... 마무리 된 reducer 합치기
const rootReducer = combineReducers({
    // 하나 하나가 redux store의 이름
    user,
    chatRoom

})

export default rootReducer