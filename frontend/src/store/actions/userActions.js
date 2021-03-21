import userService from '../../services/userService'
import { loading, doneLoading } from './systemActions'

// THUNK
export function loadUsers() {
  return async (dispatch) => {
    try {
      // example for loading
      dispatch(loading())
      const users = await userService.getUsers()
      dispatch({ type: 'SET_USERS', users })
    } catch (err) {
      console.log('UserActions: err in loadUsers', err)
      // example for rerouting - after changing the store
      // history.push('/some/path');
    } finally {
      dispatch(doneLoading())
    }
  }
}
// THUNK
export function removeUser(userId) {
  return async (dispatch) => {
    try {
      await userService.remove(userId)
      dispatch({ type: 'USER_REMOVE', userId })
    } catch (err) {
      console.log('UserActions: err in removeUser', err)
    }
  }
}
// THUNK
export function login(userCreds) {
  return async (dispatch) => {
    try {
      const user = await userService.login(userCreds)
      dispatch({ type: 'SET_USER', user })
      return user
    } catch (err) {
      console.log('UserActions: err in login', err)
    }
  }
}
export function signup(userCreds) {
  return async (dispatch) => {
    const user = await userService.signup(userCreds)
    dispatch({ type: 'SET_USER', user })
  }
}
export function logout() {
  return async (dispatch) => {
    await userService.logout()
    dispatch({ type: 'SET_USER', user: null })
  }
}

export function loginByGoogle(userCreds) {
  return async (dispatch) => {
    const user = await userService.loginByGoogle(userCreds)
    dispatch({ type: 'SET_USER', user })
  }
}

export function guestLogin() {
  return async dispatch => {
      try {
          const user = await userService.guestLogin();
          dispatch({ type: 'SET_USER', user })
      } catch (err) {
          console.log('userActions: Couldn\'t login as a guest');
          throw err;
      }
  }
}

export function updateUser(newUser) {
  return async (dispatch) => {
    const user = await userService.update(newUser)
    dispatch({ type: 'UPDATE_USER', user })
  }
}

export function toggleFavUserBoardList(loggedInUser,boardId){
    const newFavBoardList = loggedInUser.favBoards.filter(_boardId=>_boardId===boardId)
    if(newFavBoardList.length>0){
      return async dispatch => {
        try{
            const user = await userService.removeFavBoard(loggedInUser,boardId)
            dispatch({ type: 'REMOVE_FAV_BOARD', user})
        }catch(err){
            console.log('UserActions: err in removeFavoriteBoard', err); 
        }
      }
    }else{
      return async (dispatch) => {
        try{
            const user = await userService.addFavBoard(loggedInUser,boardId)
            dispatch({ type: 'ADD_FAV_BOARD', user})
        }catch(err){
            console.log('UserActions: err in addFavoriteBoard', err); 
        }
      }
    }
}

