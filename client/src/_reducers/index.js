import { combineReducers } from 'redux';
import user from './user_reducer';

const rootReducer = combineReducers({
    user
})

export default rootReducer;

//combineRudcers는 rootReducer로 합치는 역할