import httpService from './httpService'

export default {
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
  guestLogin
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
