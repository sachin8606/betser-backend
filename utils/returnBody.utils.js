exports.returnUsers = (user) => {
    return {
        "id":user?.id,
        "firstName": user?.firstName,
        "lastName":user?.lastName,
        "countryCode":user?.countryCode,
        "nickName":user?.nickName,
        "email":user?.email,
        "phone":user?.phone,
        "isMobileVerified":user?.isMobileVerified,
        "isEmailVerified":user?.isEmailVerified,
        "createdAt":user?.createdAt,
        "updatedAt":user?.updatedAt,
        "avatar":user?.avatar
    }
}