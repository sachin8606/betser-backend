let adminFcmTokens = {}

const setAdminFcmToken = (token,id=null) => {
    console.log(token)
    adminFcmTokens["admin"] = token
}

const getAdminFcmToken = (id=null) => {
    return adminFcmTokens["admin"]
}
module.exports = {setAdminFcmToken, getAdminFcmToken}