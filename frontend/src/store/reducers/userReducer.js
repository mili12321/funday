let localLoggedinUser = null
if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user)

const initialState = {
  loggedInUser: localLoggedinUser,
  users: [],
}

export function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, loggedInUser: action.user}
    case 'USER_REMOVE':
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.userId),
      }
    case 'SET_USERS':
      return { ...state, users: action.users }

    case 'UPDATE_USER':
      return { ...state, loggedInUser: action.user }
    case 'ADD_FAV_BOARD':
      return { ...state, loggedInUser: action.user }
    case 'REMOVE_FAV_BOARD':
      return { ...state, loggedInUser: action.user }
    default:
      return state
  }
}
