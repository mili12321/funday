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
      // return user
    } catch (err) {
      console.log('UserActions: err in login', err)
      throw err;
    }
  }
}
export function signup(userCreds) {
  return async dispatch => {
    try {
        const user = await userService.signup(userCreds);
        dispatch({ type: 'SET_USER', user })
    } catch (err) {
        console.log('userActions: Couldn\'t signup', err);
        return Promise.reject(err);
    }
  }
  // return async (dispatch) => {
  //   const user = await userService.signup(userCreds)
  //   dispatch({ type: 'SET_USER', user })
  // }
}


export function logout() {
  return dispatch => {
      try {
          userService.logout();
          dispatch({ type: 'SET_USER', user: null })
      } catch (err) {
          console.log('userActions: Couldn\'t logout');
          throw err;
      }
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

export function sendNotification(toUser,from,section,content,taskId,tableId,boardId,WorkspaceId){
  return async dispatch => {
    try{
      const user =await userService.sendNotification(toUser,from,section,content,taskId,tableId,boardId,WorkspaceId)
      if(toUser._id===from){
        dispatch({ type: 'UPDATE_USER', user })
      }
    }catch(err){
        console.log('UserActions: err in sendNotification', err); 
    }
  }
}

export function removeNotification(currUser, notificationId){
  return async dispatch => {
    try{
      const user =await userService.removeNotification(currUser, notificationId)
      dispatch({ type: 'UPDATE_USER', user })
    }catch(err){
        console.log('UserActions: err in removeNotification', err); 
    }
  }
}

export function removeAllNotifications(currUser){
  return async dispatch => {
    try{
      const user =await userService.removeAllNotifications(currUser)
      dispatch({ type: 'UPDATE_USER', user })
    }catch(err){
        console.log('UserActions: err in removeAllNotifications', err); 
    }
  }
}


export function markAsRead(currUser, notificationId){
  return async dispatch => {
    try{
      const user = await userService.markAsRead(currUser, notificationId)
      dispatch({ type: 'UPDATE_USER', user })
    }catch(err){
      console.log('UserActions: err in markAsRead', err); 
    }
  }
}


export function toggleMarkAsRead(currUser, notificationId){
  return async dispatch => {
    try{
      const user = await userService.toggleMarkAsRead(currUser, notificationId)
      dispatch({ type: 'UPDATE_USER', user })
    }catch(err){
      console.log('UserActions: err in toggleMarkAsRead', err); 
    }
  }
}


export function markAllAsRead(currUser){
  return async dispatch => {
    try{
      const user = await userService.markAllAsRead(currUser)
      dispatch({ type: 'UPDATE_USER', user })
    }catch(err){
      console.log('UserActions: err in markAllAsRead', err); 
    }
  }
}


