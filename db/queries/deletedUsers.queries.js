const User = require('../../models/deletedUser.model');

exports.createDeletedUser = async ({id,firstName,lastName,countryCode,nickName,email,phone,role,avatar,isActive,isEmailVerified,isMobileVerified}) => {
  const [user, created] = await User.upsert(
    {id,firstName,lastName,email,countryCode,phone,role,avatar,isActive,isEmailVerified,isMobileVerified},
    { returning: true }
  );
  return user
};

exports.findAllDeletedUsers = async ({ filters = {}, page = 1, limit = 1 }) => {
  const offset = (page - 1) * limit;
  const result = await User.findAndCountAll({
    where: filters,
    attributes: ['firstName', 'lastName', 'countryCode', 'phone', 'createdAt', 'updatedAt','email','id'],
    order: [['createdAt', 'DESC']],
    limit,
    offset
  })

  return {
    totalPages: Math.ceil(result.count / limit),
    currentPage: page,
    data: result.rows,
  };
}

exports.findDeletedUser = async (id) => {
  return await User.findByPk(
    id,
    {
    attributes: { exclude: ['password'] }
  });
};
