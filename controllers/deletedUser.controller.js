const { findAllDeletedUsers, findDeletedUser } = require("../db/queries/deletedUsers.queries")

exports.getAllDeletedUsers = async(req,res) => {
    try{
        const users = await findAllDeletedUsers(req.body);
        res.status(200).json({"message":"success","users":users})
    }catch(error){
        res.status(400).json({"message":"error"})
    }
}

exports.getDeletedUser = async(req,res) => {
    try{
        const user = await findDeletedUser(req.params.id)
        res.status(200).json({"message":"success","users":user})
    }catch(error){
        res.status(400).json({"message":error})
    }
}

