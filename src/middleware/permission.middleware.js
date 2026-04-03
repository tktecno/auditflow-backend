export const permit = (...allowerdRoles)=>{
    return (req,res,next) => {
        const userRole = req.user.role;
        if(!allowerdRoles.includes(userRole))
        {
            return res.status(403).json({
                message:"Forbidden: You don't have permission"
            });
        }
        next();
    };
};