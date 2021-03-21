const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = {}) {
  console.log('filter from backend', filterBy)
//   const criteria = _buildCriteria(filterBy)
  const criteria = {}
  const collection = await dbService.getCollection('workspace')
  try {
    const workspaces = await collection.find(criteria).toArray()
    return workspaces
  } catch (err) {
    console.log('ERROR: cannot find workspaces')
    throw err
  }
}

async function getById(id) {
  const collection = await dbService.getCollection('workspace')
  try {
    const workspace = await collection.findOne({ _id: ObjectId(id) })
    return workspace
  } catch (err) {
    console.log(`ERROR: while finding workspace ${id}`)
    throw err
  }
}

async function update(workspace) {
  console.log('workspace from workspace.service', workspace)
  const collection = await dbService.getCollection('workspace')
  workspace._id = ObjectId(workspace._id)

  try {
    await collection.replaceOne({ _id: workspace._id }, { $set: workspace })
    console.log('workspace from workspace service', workspace)
    return workspace
  } catch (err) {
    console.log(`ERROR: cannot update workspace ${workspace._id}`)
    throw err
  }
}

async function remove(workspaceId) {
    const collection = await dbService.getCollection('workspace')
    try {
        await collection.deleteOne({ "_id": ObjectId(workspaceId) })
    } catch (err) {
        console.log(`ERROR: cannot remove workspace ${workspaceId}`)
        throw err;
    }
}

async function add(workspace) {
  console.log("workspace from backend:",workspace)
    const collection = await dbService.getCollection('workspace')
    try {
        await collection.insertOne(workspace);
        return workspace;
    } catch (err) {
        console.log(`ERROR: cannot insert workspace`)
        throw err;
    }
}

module.exports = {
  query,
  getById,
  update,
  remove,
  add
}




// function _buildCriteria(filterBy) {
//   const criteria = {}
//   // return criteria
//   if (filterBy.search) {
//     criteria.title = { $regex: new RegExp(filterBy.search, 'ig') }
//   }

//   // return criteria
//   if (!filterBy.maxYear) {
//     filterBy.maxYear = Infinity
//   }
//   if (!filterBy.minYear) {
//     filterBy.minYear = -Infinity
//   }

//   if (filterBy.minYear) {
//     criteria.year = { $gte: +filterBy.minYear, $lte: +filterBy.maxYear }
//   }

//   if (filterBy.type === 'All') return criteria
//   criteria.type = filterBy.type
//   return criteria
// }
