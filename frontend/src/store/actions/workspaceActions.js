import { workspaceService } from '../../services/workspaceService'
import { loading, doneLoading } from './systemActions';

export function loadWorkspaces(filterBy) {
  
    return async dispatch => {
        try{
            dispatch(loading());
            const workspaces = await workspaceService.query(filterBy);
            dispatch({ type: 'SET_WORKSPACES', workspaces })
        }catch(err){
            console.log('WorkspaceActions: err in loadWorkspaces', err);
        }finally{
            dispatch(doneLoading());
        }
    }
}

export function addWorkspace(newworkspace) {
    return async dispatch => {
        try{
          const workspace = await workspaceService.add(newworkspace)
            dispatch({ type: 'ADD_WORKSPACE', workspace})
            return workspace
        }catch(err){
            console.log('WorkspaceActions: err in addWorkspace', err); 
        }
    }
}

export function updateWorkspace(workspace) {
    return async dispatch => {
        try{
            await workspaceService.save(workspace)
            dispatch({ type: 'UPDATE_WORKSPACE', workspace})
        }catch(err){
            console.log('WorkspaceActions: err in updateWorkspace', err); 
        }
    }
}

export function removeWorkspace(workspaceId) {
    return async (dispatch) => {
      try {
        await workspaceService.remove(workspaceId)
        dispatch({ type: 'REMOVE_WORKSPACE', workspaceId })
      } catch (err) {
        console.log('WorkspaceActions: err in removeWorkspace', err)
      }
    }
  }

    
export function updateCurrWorkspace(workspace) {
    return async (dispatch) => {
      try {
        dispatch({ type: 'UPDATE_CURR_WORKSPACE', workspace })
      } catch (err) {
        console.log('WorkspaceActions: err in updateCurrWorkspace', err)
      }
    }
}
export function updateBoardWorkspace(workspace) {
    return async (dispatch) => {
      try {
        dispatch({ type: 'UPDATE_BOARD_WORKSPACE', workspace })
      } catch (err) {
        console.log('WorkspaceActions: err in updateBoardWorkspace', err)
      }
    }
}

export function updateTaskConversation(location) {
  return async (dispatch) => {
    try {
      dispatch({ type: 'UPDATE_TASK_CONVERSATION', location })
    } catch (err) {
      console.log('WorkspaceActions: err in updateTaskConversation', err)
    }
  }
}

export function toggleTaskConversationModal() {
  return async (dispatch) => {
    try {
      dispatch({ type: 'TOGGLE_TASK_CONVERSATION_MODAL' })
    } catch (err) {
      console.log('WorkspaceActions: err in toggleTaskConversationModal', err)
    }
  }
}



export function updateBoards(newBoard) {
    return async (dispatch) => {
      try {
        // await workspaceService.updateBoards(workspace,newBoard)
        dispatch({ type: 'UPDATE_BOARDS', newBoard })
      } catch (err) {
        console.log('WorkspaceActions: err in updateBoards', err)
      }
    }
}
export function removeBoards(newBoard) {
    return async (dispatch) => {
      try {
        // await workspaceService.updateBoards(workspace,newBoard)
        dispatch({ type: 'REMOVE_BOARDS', newBoard })
      } catch (err) {
        console.log('WorkspaceActions: err in removeBoards', err)
      }
    }
}
export function addBoards(newBoard) {
    return async (dispatch) => {
      try {
        // await workspaceService.updateBoards(workspace,newBoard)
        dispatch({ type: 'ADD_BOARDS', newBoard })
      } catch (err) {
        console.log('WorkspaceActions: err in addBoards', err)
      }
    }
}

  

  



export function getCurrBoard(board) {
    return async dispatch => {
        try{
            dispatch({ type: 'SET_BOARD', board})
        }catch(err){
            console.log('WorkspaceActions: err in SET_BOARD', err); 
        }
    }
}
export function updateCurrBoard(board) {
    return async dispatch => {
        try{
            dispatch({ type: 'UPDATE_BOARD', board})
        }catch(err){
            console.log('WorkspaceActions: err in UPDATE_BOARD', err); 
        }
    }
}

export function addCheckedTasks(currCheckedTask) {
    return async dispatch => {
        try{
            dispatch({ type: 'ADD_CHECKED_TASK', currCheckedTask})
        }catch(err){
            console.log('WorkspaceActions: err in ADD_CHECKED_TASK', err); 
        }
    }
}
export function removeCheckedTasks(taskId) {
    return async dispatch => {
        try{
            dispatch({ type: 'REMOVE_CHECKED_TASK', taskId})
        }catch(err){
            console.log('WorkspaceActions: err in REMOVE_CHECKED_TASK', err); 
        }
    }
}

