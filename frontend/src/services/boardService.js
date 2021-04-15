import httpService from './httpService'
export const boardService = {
    getById,
    addBoard,
    addBoardInFolder,
    removeBoard,
    addFolder,
    removeFolder,
    updateFolder,
    addTable,
    removeTable,
    updateTable,
    addTask,
    removeTask,
    updateTask
}


//BOARD

function getById(workspaces,boardId){
    let board ={}
    workspaces.map(workspace=>
        workspace.boards.map(_board=>
            _board._id===boardId?board=_board:board=null
        )
    )
    if(!board){
        workspaces.map(workspace=>
            workspace.folders.map(folder=>
                folder.boards.map(_board=>
                    _board._id===boardId?board=_board:board=null
                )
            )
        )
    }
    return board
}

function addBoard(currWorkspace, boardName) {
    const newBoard = {
        _id : Date.now().toString(16) + Math.random().toString(16),
        isLastSeen : false,
        name : boardName,
        desc : "Add board description",
        createdAt : Date.now(),
        lastUpdated : null,
        dropdownLabels:[],
        statusLabelList: [
                {
                    _id : uniqId(),
                    color:"#ffbe0c",
                    name:"Working on it"
                },
                {
                    _id : uniqId(),
                    color:"#2bd44e",
                    name:"Done"
                },
                {
                    _id : uniqId(),
                    color:"#c73d51",
                    name:"Delayed"
                },
                {
                    _id : uniqId(),
                    color:"rgb(255 60 125)",
                    name:"To do"
                }
            ],
            activities : [],
            isPrivate : false,
            owner : {},
            tableColumns : [ 
                {
                    _id :uniqId(),
                    title : "Group Title",
                    type : "Group Title",
                    taskKey : "name"
                }, 
                {
                    _id :uniqId(),
                    title : "Person123",
                    type : "People",
                    taskKey : "owner"
                }, 
                {
                    _id : uniqId(),
                    title : "Status123",
                    type : "Status",
                    taskKey : "status"
                }, 
                {
                    _id : uniqId(),
                    title : "Date",
                    type : "Date",
                    taskKey : "createdAt"
                }
            ],
            tables : [ 
                {
                    _id : uniqId(),
                    name : "Group Title",
                    color : "#0085ff",
                    createdAt : Date.now(),
                    lastUpdated : "",
                    tasks : [ 
                        {
                            _id : uniqId(),
                            name : "Item 1",
                            createdAt :Date.now(),
                            conversations : [],
                            package : "",
                            owner : [],
                            dropdown : [],
                            milestone : "",
                            status : {
                                name : "Done",
                                color : "rgb(43, 212, 78)"
                            },
                            policyState : {
                                name : "",
                                color : ""
                            },
                            timeline : {
                                from : "",
                                to : ""
                            },
                            duration : "",
                            tags : [],
                            files : [],
                            weight : "",
                            dateCompleted : null,
                            progress : "",
                            lastUpdated : {}
                        }, 
                        {
                            _id : uniqId(),
                            name : "Item 2",
                            createdAt :Date.now(),
                            conversations : [],
                            package : "",
                            owner : [],
                            dropdown : [],
                            milestone : "",
                            status : {
                                name : "Working on it",
                                color : "rgb(255, 190, 12)"
                            },
                            policyState : {
                                name : "",
                                color : ""
                            },
                            timeline : {
                                from : "",
                                to : ""
                            },
                            duration : "",
                            tags : [],
                            files : [],
                            weight : "",
                            dateCompleted : null,
                            progress : "",
                            lastUpdated : {}
                        }, 
                        {
                            _id :uniqId(),
                            name : "Item 3",
                            createdAt :Date.now(),
                            conversations : [],
                            package : "",
                            owner : [],
                            dropdown : [], 
                            milestone : "",
                            status : {
                                name : "",
                                color : "rgb(180, 182, 188)"
                            },
                            policyState : {
                                name : "",
                                color : ""
                            },
                            timeline : {
                                from : "",
                                to : ""
                            },
                            duration : "",
                            tags : [],
                            files : [],
                            weight : "",
                            dateCompleted : null,
                            progress : "",
                            lastUpdated : {}
                        }
                    ]
                }, 
                {
                    _id :uniqId(),
                    name : "Group Title",
                    color : "#b456dd",
                    createdAt : Date.now(),
                    lastUpdated : "",
                    tasks : [ 
                        {
                            _id : uniqId(),
                            name : "Item 4",
                            createdAt :Date.now(),
                            conversations : [],
                            package : "",
                            owner : [],
                            dropdown : [],
                            milestone : "",
                            status : {
                                name : "",
                                color : "rgb(180, 182, 188)"
                            },
                            policyState : {
                                name : "",
                                color : ""
                            },
                            timeline : {
                                from : "",
                                to : ""
                            },
                            duration : "",
                            tags : [],
                            files : [],
                            weight : "",
                            dateCompleted : null,
                            progress : "",
                            lastUpdated : {}
                        }, 
                        {
                            _id : uniqId(),
                            name : "Item 5",
                            createdAt :Date.now(),
                            conversations : [],
                            package : "",
                            owner : [],
                            dropdown : [],
                            milestone : "",
                            status : {
                                name : "",
                                color : "rgb(180, 182, 188)"
                            },
                            policyState : {
                                name : "",
                                color : ""
                            },
                            timeline : {
                                from : "",
                                to : ""
                            },
                            duration : "",
                            tags : [],
                            files : [],
                            weight : "",
                            dateCompleted : null,
                            progress : "",
                            lastUpdated : {}
                        }
                    ]
                }
            ]
    }
    const newWorkspace = currWorkspace
    newWorkspace.boards = [...newWorkspace.boards,newBoard]
    return newWorkspace
}

function addBoardInFolder(currWorkspace,folder,boardName="New Board") {
    const newBoard = {
        _id : Date.now().toString(16) + Math.random().toString(16),
        isLastSeen : false,
        name : boardName,
        desc : "Add board description",
        createdAt : Date.now(),
        lastUpdated : null,
        dropdownLabels:[],
        statusLabelList: [
                {
                    _id : uniqId(),
                    color:"#ffbe0c",
                    name:"Working on it"
                },
                {
                    _id : uniqId(),
                    color:"#2bd44e",
                    name:"Done"
                },
                {
                    _id : uniqId(),
                    color:"#c73d51",
                    name:"Delayed"
                },
                {
                    _id : uniqId(),
                    color:"rgb(255 60 125)",
                    name:"To do"
                }
            ],
            activities : [ ],
            isPrivate : false,
            owner : {},
            tableColumns : [ 
                {
                    _id :uniqId(),
                    title : "Group Title",
                    type : "Group Title",
                    taskKey : "name"
                }, 
                {
                    _id :uniqId(),
                    title : "Person123",
                    type : "People",
                    taskKey : "owner"
                }, 
                {
                    _id : uniqId(),
                    title : "Status123",
                    type : "Status",
                    taskKey : "status"
                }, 
                {
                    _id : uniqId(),
                    title : "Date",
                    type : "Date",
                    taskKey : "createdAt"
                }
            ],
            tables : [ 
                {
                    _id : uniqId(),
                    name : "Group Title",
                    color : "#0085ff",
                    createdAt : Date.now(),
                    lastUpdated : "",
                    tasks : [ 
                        {
                            _id : uniqId(),
                            name : "Item 1",
                            createdAt :Date.now(),
                            conversations : [],
                            package : "",
                            owner : [],
                            dropdown : [],
                            milestone : "",
                            status : {
                                name : "Done",
                                color : "rgb(43, 212, 78)"
                            },
                            policyState : {
                                name : "",
                                color : ""
                            },
                            timeline : {
                                from : "",
                                to : ""
                            },
                            duration : "",
                            tags : [],
                            files : [],
                            weight : "",
                            dateCompleted : null,
                            progress : "",
                            lastUpdated : {}
                        }, 
                        {
                            _id : uniqId(),
                            name : "Item 2",
                            createdAt :Date.now(),
                            conversations : [],
                            package : "",
                            owner : [],
                            dropdown : [],
                            milestone : "",
                            status : {
                                name : "Working on it",
                                color : "rgb(255, 190, 12)"
                            },
                            policyState : {
                                name : "",
                                color : ""
                            },
                            timeline : {
                                from : "",
                                to : ""
                            },
                            duration : "",
                            tags : [],
                            files : [],
                            weight : "",
                            dateCompleted : null,
                            progress : "",
                            lastUpdated : {}
                        }, 
                        {
                            _id :uniqId(),
                            name : "Item 3",
                            createdAt :Date.now(),
                            conversations : [],
                            package : "",
                            owner : [],
                            dropdown : [],
                            milestone : "",
                            status : {
                                name : "",
                                color : "rgb(180, 182, 188)"
                            },
                            policyState : {
                                name : "",
                                color : ""
                            },
                            timeline : {
                                from : "",
                                to : ""
                            },
                            duration : "",
                            tags : [],
                            files : [],
                            weight : "",
                            dateCompleted : null,
                            progress : "",
                            lastUpdated : {}
                        }
                    ]
                }, 
                {
                    _id :uniqId(),
                    name : "Group Title",
                    color : "#b456dd",
                    createdAt : Date.now(),
                    lastUpdated : "",
                    tasks : [ 
                        {
                            _id : uniqId(),
                            name : "Item 4",
                            createdAt :Date.now(),
                            conversations : [],
                            package : "",
                            owner : [],
                            dropdown : [],
                            milestone : "",
                            status : {
                                name : "",
                                color : "rgb(180, 182, 188)"
                            },
                            policyState : {
                                name : "",
                                color : ""
                            },
                            timeline : {
                                from : "",
                                to : ""
                            },
                            duration : "",
                            tags : [],
                            files : [],
                            weight : "",
                            dateCompleted : null,
                            progress : "",
                            lastUpdated : {}
                        }, 
                        {
                            _id : uniqId(),
                            name : "Item 5",
                            createdAt :Date.now(),
                            conversations : [],
                            package : "",
                            owner : [],
                            dropdown : [],
                            milestone : "",
                            status : {
                                name : "",
                                color : "rgb(180, 182, 188)"
                            },
                            policyState : {
                                name : "",
                                color : ""
                            },
                            timeline : {
                                from : "",
                                to : ""
                            },
                            duration : "",
                            tags : [],
                            files : [],
                            weight : "",
                            dateCompleted : null,
                            progress : "",
                            lastUpdated : {}
                        }
                    ]
                }
            ]
    }
    let newFolder = {...folder}
    newFolder.boards = [...newFolder.boards,newBoard]

    currWorkspace.folders = currWorkspace.folders.map(_folder=>
        _folder._id===newFolder._id?newFolder:_folder
    )
    return currWorkspace
}

function removeBoard(currWorkspace, boardId) {
    var boardToRemove =null
    let newWorkspace = {}
    currWorkspace.boards.forEach(_board=>
        _board._id===boardId?
        boardToRemove={..._board}
        :
        null
    )
    if(boardToRemove){
        // board inside the workspace
        newWorkspace={
            ...currWorkspace,
            boards: currWorkspace.boards.filter(_board=>
                _board._id!==boardId
            )
        }
    }else{
        currWorkspace.folders.forEach(folder=>
            folder.boards.forEach(_board=>
                _board._id===boardId?boardToRemove=_board:null
            )
        )
        if(boardToRemove){
            // board inside the folder
            let currFolder = {}
            currWorkspace.folders.forEach(folder=>
                folder.boards.forEach(_board=>_board._id===boardToRemove._id?
                currFolder=folder
                :
                null
                )
            )
            newWorkspace={
                ...currWorkspace,
                folders:currWorkspace.folders.map(folder=>
                    folder._id===currFolder._id?
                    folder = {
                        ...folder,
                        boards: folder.boards.filter(_board=>
                            _board._id!==boardToRemove._id
                        )
                    }
                    :
                    folder
                )
            }
        }
    }
    return newWorkspace
    
}

function addFolder(currWorkspace) {
    const newFolder = {
        _id : Date.now().toString(16) + Math.random().toString(16),
        name : "New Folder",
        boards : []
    }
    const newWorkspace = currWorkspace
    newWorkspace.folders = [...newWorkspace.folders,newFolder]
    return newWorkspace
}

function removeFolder(currWorkspace, folderId) {
    const newWorkspace = currWorkspace
    newWorkspace.folders = newWorkspace.folders.filter(folder=>folder._id!==folderId)
    return newWorkspace
}
function updateFolder(currWorkspace, newFolder) {
    const newWorkspace = currWorkspace
    newWorkspace.folders = newWorkspace.folders.map(folder=>folder._id===newFolder._id?newFolder:folder)
    return newWorkspace
}


//TABLE

function addTable(currBoard) {
    const newTable = {
        _id : Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16),
        name : "New Group",
        color : "rgb(180, 182, 188)",
        createdAt : Date.now(),
        lastUpdated : "",
        tasks : []
    }
    const newBoard = currBoard
    newBoard.tables = [ newTable,...newBoard.tables]
    return newBoard
}

function removeTable(tableId,currBoard) {
    const newBoard = currBoard
    newBoard.tables = newBoard.tables.filter(table=>table._id!==tableId)
    return newBoard
}

function updateTable(currBoard,updatedTable) {
    const newBoard ={
        ...currBoard, 
        tables: currBoard.tables.map(table=>
            table._id===updatedTable._id?
            updatedTable
            :table
        )
    }
    return newBoard
}

//TASK

function addTask(currTable,currBoard,userInput,user) {
    const newTask = {
        _id : Date.now().toString(16) + Math.random().toString(16) + '0'.repeat(16),
        name : userInput,
        createdAt : Date.now(),
        conversations : [],
        package : "",
        owner : [],
        dropdown : [],
        milestone : "",
        status : {
            name : "",
            color : "rgb(180, 182, 188)"
        },
        policyState : {
            name : "",
            color : ""
        },
        timeline : {
            from : "",
            to : ""
        },
        duration : "",
        tags : [],
        files : [],
        weight : "",
        dateCompleted : null,
        progress : "",
        lastUpdated : {
            byUser : user,
            date : new Date().getTime() // if Date.now()-time stemp < 1 min then output "just now" else output 1 minute ago
        }
    }
    newTask.owner.push(user._id)
    const newBoard = currBoard
    newBoard.tables.map(table=>
        table._id===currTable._id?table.tasks.push(newTask):table
        )
    return newBoard
}


function updateTask(currTable,currBoard,updatedTask,user) {
    updatedTask.lastUpdated={
        byUser : user._id,
        date :new Date().getTime()
    }
    const newBoard ={
        ...currBoard, 
        tables: currBoard.tables.map(table=>
            table._id===currTable._id?
           {...table, tasks:
            table.tasks.map(task=>
                task._id===updatedTask._id?
                updatedTask:task
            )
            }
            :table
        )
    }
    return newBoard
}



function removeTask(taskId,currTable,currBoard) {
    const newTable = {
        ...currTable,
        tasks:currTable.tasks.filter(task=>task._id!==taskId)
    }
    const newBoard ={
        ...currBoard, 
        tables: currBoard.tables.map(table=>
            table._id===newTable._id?
            newTable
            :table
        )
    }

    return newBoard
}


function uniqId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};