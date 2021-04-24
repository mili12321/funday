const initialState = {
    workspaces: [],
    currWorkspace:{},
    boards:[],
    currBoard: {},
    checkedTasks:[],
    boardWorkspace:{},
    conversationLocation:{},
    isTaskConversationModalOpen:false
}

export function workspaceReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_WORKSPACES':
            return {
                ...state,
                workspaces: action.workspaces
            }
        case 'UPDATE_CURR_WORKSPACE':
            return {
            ...state,
            currWorkspace: action.workspace
            } 
        case 'UPDATE_BOARD_WORKSPACE':
            return {
            ...state,
            boardWorkspace: action.workspace
            }
        case 'ADD_WORKSPACE':
            const workspaces = [...state.workspaces, action.workspace]
            return {
                ...state,
                workspaces,
                currWorkspace: action.workspace
                } 
        case 'REMOVE_WORKSPACE':
            return {
                ...state,
                workspaces: state.workspaces.filter((workspace) => workspace._id !== action.workspaceId),
            }
        case 'UPDATE_WORKSPACE':
            return {
                ...state,
                workspaces: state.workspaces.map(workspace => workspace._id === action.workspace._id?action.workspace:workspace )
            } 
        case 'UPDATE_BOARDS':
            return {
                ...state,
                boards: state.currWorkspace.baords.map( baord=> baord._id === action.newBoard._id?action.newBoard:baord )
            } 
        case 'ADD_BOARDS':
            return {
                ...state,
                boards: [...state.currWorkspace.baords, action.newBoard]
        } 
        case 'REMOVE_BOARDS':
            return {
                ...state,
                boards: state.currWorkspace.baords.filter( baord=> baord._id !== action.newBoard._id)
        }
        case 'UPDATE_BOARD':
            return {
                ...state,
                currBoard: action.board
            }
        case 'SET_BOARD':
            return {
                ...state,
                currBoard: action.board
            }
        case 'ADD_CHECKED_TASK':
            return {
                ...state,
                checkedTasks: [...state.checkedTasks,action.currCheckedTask]
            }  
        case 'REMOVE_CHECKED_TASK':
            return {
                ...state,
                checkedTasks: state.checkedTasks.filter(task=>task._id!==action.taskId)
            } 
        case 'UPDATE_TASK_CONVERSATION':
            return {
                ...state,
                conversationLocation: action.location
            }  
        case 'TOGGLE_TASK_CONVERSATION_MODAL':
            return {
                ...state,
                isTaskConversationModalOpen: !state.isTaskConversationModalOpen
            }   
        default:
            return state
    }
}