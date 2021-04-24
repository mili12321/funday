import httpService from './httpService'

export const userService = {
  login,
  logout,
  signup,
  getUsers,
  getById,
  remove,
  update,
  removeFavBoard,
  addFavBoard,
  loginByGoogle,
  guestLogin,
  sendNotification,
  markAsRead,
  toggleMarkAsRead,
  removeNotification,
  removeAllNotifications,
  markAllAsRead
}

function getUsers() {
  return httpService.get('user')
}

function getById(userId) {
  return httpService.get(`user/${userId}`)
}
function remove(userId) {
  return httpService.delete(`user/${userId}`)
}

async function update(user) {
  const newUser = await httpService.put(`user/${user._id}`, user)
  return _handleLogin(newUser)
}

async function login(userCred) {
  const user = await httpService.post('auth/login', userCred)
  if(user){ 
    return _handleLogin(user)
  }
  // return _handleLogin(user)
}
async function signup(userCred) {
  const user = await httpService.post('auth/signup', userCred)
  return _handleLogin(user)
}
async function logout() {
  await httpService.post('auth/logout')
  sessionStorage.clear()
}

async function loginByGoogle(userCred) {
  const user = await httpService.post('auth/loginByGoogle', userCred)
  return _handleLogin(user)
}

function _handleLogin(user) {
  sessionStorage.setItem('user', JSON.stringify(user))
  return user
}

async function guestLogin() {
  try {
      const user = await login({ email: 'guest@gmail.com', password: '12345' });
      return user
  } catch (err) {
      console.log('userService: Couldn\'t login as guest');
      throw err;
  }
}

async function addFavBoard(user,boardId){
  user.favBoards = [boardId, ...user.favBoards]
  const newUser = await httpService.put(`user/${user._id}`, user)
  return _handleLogin(newUser)
}

async function removeFavBoard(user,boardId){
  user.favBoards = user.favBoards.filter(_boardId=>_boardId!==boardId)
  const newUser = await httpService.put(`user/${user._id}`, user)
  return _handleLogin(newUser)
}

async function sendNotification(user,from,section,content,taskId,tableId,boardId,WorkspaceId){

  const notification = {
    _id:Date.now().toString(16) + Math.random().toString(16),
    from,
    to:user._id,
    section,
    content,
    createdAt: Date.now(),
    isRead:false,
    //for opening the conversation modal with the curr task conversation
    conversationLocation:{
        taskId,
        tableId,
        boardId,
        WorkspaceId,
    }
  }

  user.notifications = [notification,...user.notifications]
  const newUser = await httpService.put(`user/${user._id}`, user)
  if(user._id===from){
    return _handleLogin(newUser)
  }
}

async function markAsRead(user, notificationId){
  const notification = user.notifications.filter(_notification=>_notification._id===notificationId)[0]
  user.notifications = user.notifications.map(_notification=>
      _notification._id===notificationId?{...notification, isRead:true}:_notification
  )
  const newUser = await httpService.put(`user/${user._id}`, user)
  return _handleLogin(newUser)
}

async function toggleMarkAsRead(user, notificationId){
  const notification = user.notifications.filter(_notification=>_notification._id===notificationId)[0]
  if(notification.isRead){
    user.notifications = user.notifications.map(_notification=>
      _notification._id===notificationId?{...notification, isRead:false}:_notification
      )
  }else{
    user.notifications = user.notifications.map(_notification=>
      _notification._id===notificationId?{...notification, isRead:true}:_notification
      )
  }
  const newUser = await httpService.put(`user/${user._id}`, user)
  return _handleLogin(newUser)
}

async function markAllAsRead(user){

  user.notifications.forEach(notification => {
    notification.isRead=true
  });

  const newUser = await httpService.put(`user/${user._id}`, user)
  return _handleLogin(newUser)
}


async function removeNotification(user, notificationId) {
  user.notifications = user.notifications.filter(notification=>notification._id!==notificationId)
  const newUser = await httpService.put(`user/${user._id}`, user)
  return _handleLogin(newUser)
}

async function removeAllNotifications(user) {
  user.notifications = []
  const newUser = await httpService.put(`user/${user._id}`, user)
  return _handleLogin(newUser)
}