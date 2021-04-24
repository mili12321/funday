const workspaceService = require('./workspace.service')

async function getWorkspaces(req, res) {
    console.log('Getting you workspaces');
    console.log(req.query);
    const filterBy = req.query;
    const workspaces = await workspaceService.query(filterBy)
    res.json(workspaces)
}

async function getWorkspace(req, res) {
    if (req.session.loggedinWorkspace) {
        console.log('Getting you a workspace');
    }
    const workspaceId = req.params.id;
    const workspace = await workspaceService.getById(workspaceId)
    res.json(workspace)
}



// UPDATE
async function updateWorkspace(req, res) {
    console.log('req.body',req.body)
    console.log('updateWorkspace from back',req.body)
    let updatedWorkspace
    try {
        console.log('req.body2',req.body)
        updatedWorkspace = await workspaceService.update(req.body)
        console.log('updatedWorkspace',updatedWorkspace)
    } catch{
        res.status(500).end('Cannot update workspace!')
    }
    console.log('updatedWorkspace',updatedWorkspace)
    res.json(updatedWorkspace)
}

// DELETE
async function deleteWorkspace(req, res) {
    try {
        await workspaceService.remove(req.params.id)
        res.end()
    } catch (err) {
        logger.error('Cannot delete workspace', err);
        res.status(500).send({ error: 'cannot delete workspace' })
    }
}

// ADD
async function addWorkspace(req, res) {
    var workspace = req.body;
    console.log('workspace',workspace)
    console.log('req.body',req.body)
    // console.log('req.session',req.session)
    // console.log('req.body',req.session.user)
    // workspace.byUserId = req.session.user._id;
    // workspace.owner = req.session.user;
    workspace = await workspaceService.add(workspace)

    // workspace.byUser = req.session.user;
    // // TODO - need to find aboutToy
    // workspace.aboutToy = {}
    console.log('workspace4',workspace)
    res.json(workspace)
}



module.exports = {
    getWorkspaces,
    getWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addWorkspace
}