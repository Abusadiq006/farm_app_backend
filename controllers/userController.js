const User = require('../models/User')
const bcrypt = require('bcrypt')

// UPDATE USER INFO
const updateUser = async(req, res) => {
    try{
        const userId = req.user.id
        const {name, email, role} = req.body

        // Non-admins cannot change role
        if(role && req.User.role !== 'admin' && req.user.role !== 'owner') {
            return res.status(403).json({ message: 'Only admin can change roles' })
        }

        const updated = await User.findByIdAndUpdate(
            userId,
            {name, email, role},
            {new: true}
        )

        res.status(200).json({ message: 'User updated', user: updated })
    } catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
}

// CHANGE PASSWORD
const changePassword=async(req,res)=>{
  try{
    const userId=req.user.id;
    const {oldPassword,newPassword}=req.body;

    const user=await User.findById(userId);
    if(!user)return res.status(404).json({message:'User not found'});

    const isMatch=await bcrypt.compare(oldPassword,user.password);
    if(!isMatch)return res.status(400).json({message:'Old password incorrect'});

    const hashed=await bcrypt.hash(newPassword,10);
    user.password=hashed;
    await user.save();

    res.status(200).json({message:'Password updated successfully'});
  }catch(err){
    res.status(500).json({message:'Server error',error:err.message});
  }
};

// DELETE USER
const deleteUser = async(req, res) => {
    try{
        const {id} = req.params

        // Non-admin cannot delete others
        if(req.user.role !== 'admin' && req.user.role !== 'owner'){
            if(req.user.id !== id){
                return res.status(403).json({ message: 'Access denied' })
            }
        }

        await User.findByIdAndDelete(id)

        res.status(200).json({ message: 'User deleted successfully' })
    } catch(err) {
        res.status(500).json({ message: 'Server error', error:err.message })
    }
}

module.exports = {updateUser, changePassword, deleteUser, getAllUser}