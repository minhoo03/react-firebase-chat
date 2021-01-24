// reducer 합치기
import { combineReducers } from 'redux'
import user from './user_reducer'

// dispatch -> action -> reducer... 마무리 된 reducer 합치기
const rootReducer = combineReducers({
    // 값을 이용
    user
})

export default rootReducer