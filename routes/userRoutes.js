const express=require('express')

const router=express.Router()
const {authenticateUser,authorizePermission}=require('../middleware/authentication')

const {
    getAllUsers,getSingleUser,showCurrentuser,updateUser,updateUserPassword
}=require('../controllers/userController')

router.route('/').get(authenticateUser,authorizePermission('admin'),getAllUsers)
router.route('/showMe').get(authenticateUser,showCurrentuser)
router.route('/updateUser').patch(authenticateUser,updateUser)
router.route('/updateuserPassword').patch(authenticateUser,updateUserPassword)

router.route('/:id').get(authenticateUser,getSingleUser)

module.exports=router