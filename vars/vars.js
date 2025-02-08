let adminFcmTokens = {}
let adminChat = {}

const setAdminFcmToken = (token,id=null) => {
    console.log(token)
    adminFcmTokens["admin"] = token
}

const getAdminFcmToken = (id=null) => {
    return adminFcmTokens["admin"]
}

const setChatAdmin = (id) => {
    adminChat["id"] = id
}
module.exports = {setAdminFcmToken, getAdminFcmToken}