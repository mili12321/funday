const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
require('dotenv').config()
// Express App Config
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'))
  // app.get('/**', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'public', 'index.html'))
  // })
} else {
  // var whitelist = [
  //       'http://127.0.0.1:8080',
  //       'http://localhost:8080',
  //       'http://127.0.0.1:3000',
  //       'http://localhost:3000',
  //     ]
  // var corsOptions = {
  //   origin: function (origin, callback) {
  //     if (whitelist.indexOf(origin) !== -1) {
  //       callback(null, true)
  //     } else {
  //       callback(new Error('Not allowed by CORS'))
  //     }
  //   }
  // }
  // app.use(cors(corsOptions))

  const corsOptions = {
    origin: [
      'http://127.0.0.1:8080',
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const connectSockets = require('./api/socket/socket.routes')
const workspaceRoutes = require('./api/workspace/workspace.routes')

// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/workspace', workspaceRoutes)

connectSockets(io)

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
  logger.info('Server is running on port: ' + port)
})
