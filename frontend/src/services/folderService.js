export const folderService = {
    // query,
    getById,
    // remove,
    // add,
    update
    
}

function getById(workspaces,folderId) {
    const folder = workspaces.filter(workspace=>
        workspace.folders.filter(folder=>
            folder._id===folderId
        )
    )[0]
    return folder
}

function update(newFolder,workspaces) {
    workspaces.map(workspace=>
        workspace.folders.map(folder=>
            folder._id===newFolder._id?newFolder:folder
        )
    )
    return workspaces
}
