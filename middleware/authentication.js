const CustomError=require('../errors')

const {isTokenValid}=require('../utils')

const authenticateUser=async(req,res,next)=>{
    const token=req.signedCookies.token

    if(!token){
        //console.log("no token present");
        throw new CustomError.UnauthenticatedError('Authentication failed')
    }
    try {
        const {name,userId,role}= isTokenValid({token})
        req.user={name,userId,role}
        next()
    } catch (error) {
        //console.log("token not valid");
        throw new CustomError.UnauthenticatedError('Authentication failed')
    }
}
const authorizePermission=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            throw new CustomError.UnauthorizedError('Unauthorized to access')
        }
        next()
    }
    
}




module.exports={authenticateUser,authorizePermission}