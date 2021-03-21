import { combineReducers } from 'redux';
import {userReducer} from './userReducer';
import systemReducer from './systemReducer';
import {workspaceReducer} from './workspaceReducer';
import {boardReducer} from './boardReducer';

const rootReducer = combineReducers({
  system: systemReducer,
  user: userReducer,
  workspace: workspaceReducer,
  board: boardReducer
})

export default rootReducer;