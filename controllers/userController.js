const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const createTokenuser = require('../utils/createTokenUser')
const { attachCookiesToResponse } = require('../utils')


const getAllUsers = async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password')
    res.status(StatusCodes.OK).json({ users })

}
const getSingleUser = async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }).select('-password')
    if (!user) {
        throw new CustomError.NotFoundError(`No user with Id ${req.params.id}`)
    }
    
}
const showCurrentuser = async (req, res) => {
    res.status(StatusCodes.OK).json({ user: req.user })
}
const updateUser = async (req, res) => {
    const {email,name}=req.body
    if(!email || !name){
        throw new CustomError.BadRequestError('Please provide all values')
    }
    
    const user=await User.findOneAndUpdate({name:req.user.name},{email,name},{new:true,runValidators:true})
    const tokenUser=createTokenuser(user)
    attachCookiesToResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})


}
const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide both valids')
    }
    const user=await User.findOne({name:req.user.name})
    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
    }

    user.password = newPassword
    await user.save()
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated' })
}

module.exports = {
    getAllUsers, getSingleUser, showCurrentuser, updateUser, updateUserPassword
}