import { boardService } from '../../services/boardService';
import { workspaceService } from '../../services/workspaceService'
import { loading, doneLoading } from './systemActions';


export function updateLastSeenBoard(baordId) {
    return async dispatch => {
        try{
            dispatch(loading());
            dispatch({ type: 'SET_LAST_SEEN_BOARD', baordId })
        }catch(err){
            console.log('loadLastSeenBoardActions: err in updateLastSeenBoard', err);
        }finally{
            dispatch(doneLoading());
        }
    }
}

export function loadStatusLabelList(filterBy) {
  
    return async dispatch => {
        try{
            dispatch(loading());
            const statusLabelList = await workspaceService.getStatusLabelList();
            dispatch({ type: 'SET_STATUS_LABLE_LIST', statusLabelList })
        }catch(err){
            console.log('StatusLabelListActions: err in loadStatusLabelList', err);
        }finally{
            dispatch(doneLoading());
        }
    }
}

export function addStatusLabelList(label) {
    return async dispatch => {
        try{
            await workspaceService.addLabel(label)
            dispatch({ type: 'ADD_STATUS_LABLE_LIST', label})
        }catch(err){
            console.log('StatusLabelListActions: err in addStatusLabelList', err); 
        }
    }
}

export function updateStatusLabelList(label) {
    return async dispatch => {
        try{
            await workspaceService.editLabel(label)
            dispatch({ type: 'UPDATE_STATUS_LABLE_LIST', label})
        }catch(err){
            console.log('StatusLabelListActions: err in updateStatusLabelList', err); 
        }
    }
}

export function removeStatusLabelList(loabelId) {
    return async (dispatch) => {
      try {
        await workspaceService.removeLabel(loabelId)
        dispatch({ type: 'REMOVE_STATUS_LABLE_LIST', loabelId })
      } catch (err) {
        console.log('StatusLabelListActions: err in removeStatusLabelList', err)
      }
    }
  }