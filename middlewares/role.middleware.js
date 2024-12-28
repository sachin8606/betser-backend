exports.roleAuthentication = (allowedRoles) => {
    return (req, res, next) => {
      if (req.user && allowedRoles.includes(req.user.role)) {
        return next(); 
      }
      return res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
    };
  };
  