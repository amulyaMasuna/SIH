function requireRole(role) {
  return (req, res, next) => {
    const authReq = req;
    const authUser = authReq.user;
    if(!authUser) {
      return res.status(401).json({
        message: "You are not an authenticated user.",
      })
    }

    if(authUser.role != role) {
      return res.status(403).json({
        message: "You don't have the correct role"
      })
    }

    next();
  }
}

module.exports = requireRole;