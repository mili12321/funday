import httpService from './httpService'

export const workspaceService = {
    query,
    getById,
    save,
    remove,
    add,
    addLabel,
    editLabel,
    removeLabel
    
}


function query(filterBy) {
    // const queryStr = `?search=${filterBy.search}&minYear=${filterBy.minYear}&maxYear=${filterBy.maxYear}&type=${filterBy.type}`;
    // return httpService.get(`workspace${queryStr}`);
    return httpService.get('workspace')
}

function getById(workspaceId) {
    return httpService.get(`workspace/${workspaceId}`)
}

function save(workspace) {
    return httpService.put(`workspace/${workspace._id}`, workspace)
}


function remove(workspaceId) {
    return httpService.delete(`workspace/${workspaceId}`);
}

async function add(workspace) {
    const addedWorkspace  = await httpService.post('workspace', workspace);
    return  addedWorkspace
}

//StatusLabelList
async function getCurrBoard() {
    const workspaces = await query()
    const currBoard = await workspaces.map(workspace=>workspace.boards.filter(board=>board.isLastSeen===true))[0]
    return currBoard
}

function getStatusLabelList() {
   const board = getCurrBoard()
   return board.statusLabelList
}
function addLabel(newLabel) {
   let statusLabelList = getStatusLabelList()
   statusLabelList = [...statusLabelList, newLabel]
   return statusLabelList
}
function editLabel(newLabel) {
    let statusLabelList = getStatusLabelList()
    statusLabelList.map(label=>label._id===newLabel._id?newLabel:label)
    return statusLabelList
}
function removeLabel(labelId) {
    let statusLabelList = getStatusLabelList()
    statusLabelList = statusLabelList.filter(label=>label._id!==labelId)
    return statusLabelList
}