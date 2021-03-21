const initialState = {
    board:{},
    statusLabelList:[],
    lastSeen:'177452dcf160.31ce41e0732050000000000000009'
}

export function boardReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_BOARD':
            return {
                ...state,
                board: action.board
            }
        case 'SET_LAST_SEEN_BOARD':
            return {
                ...state,
                lastSeen: action.baordId
            }

        case 'SET_STATUS_LABLE_LIST':
            return {
                ...state,
                statusLabelList: action.statusLabelList
            }
        case 'ADD_STATUS_LABLE_LIST':
            const statusLabelList = [...state.statusLabelList, action.newLabel]
            return {...state, statusLabelList} 
        case 'UPDATE_STATUS_LABLE_LIST':
            return {
                ...state,
                statusLabelList: state.statusLabelList.map(label => label._id === action.label._id?action.label:label )
            }
        case 'REMOVE_STATUS_LABLE_LIST':
            return {
                ...state,
                statusLabelList: state.statusLabelList.filter((label) => label._id !== action.labelId),
            }
        default:
            return state
    }
}