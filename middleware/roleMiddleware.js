// roleMiddleware.js
const role = (roles) => {
  return (req,res,next) => {
    // req.user.role must exist from authMiddleware
    if(!roles.includes(req.user.role)){
      return res.status(403).json({ message:'Access denied' })
    }
    next()
  }
}

module.exports = role
