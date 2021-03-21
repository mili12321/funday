const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getWorkspaces, addWorkspace, updateWorkspace, deleteWorkspace} = require('./workspace.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getWorkspaces)
// router.post('/', requireAuth, addWorkspace)
// router.put('/:id',  requireAuth, updateWorkspace)
// router.delete('/:id',  requireAuth,deleteWorkspace)
router.post('/', addWorkspace)
router.put('/:id', updateWorkspace)
router.delete('/:id', deleteWorkspace)

module.exports = router