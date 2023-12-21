const client = require("../../DB/Connection.js")
const roles = require("./validation.js")
var jwt = require("jsonwebtoken")




const auth = (roles=[])=> {

    return async (req, res, next) => {
    try {
        let user = []
        const { Authorization } = req.query;
       // console.log(Authorization)
        if (!Authorization?.startsWith('hamada')) {
            return res.json({ message: "In-valid bearer key" })
        }
        const token = Authorization.split('hamada')[1]
        if (!token) {
            return res.json({ message: "In-valid token" })
        }
        const decoded = jwt.verify(token,'hambozo')
        console.log(decoded)
        if (!decoded?.id) {
            return res.json({ message: "In-valid token payload" })
        }
        // const user = await userModel.findById(decoded._id).select('userName email role')
        // if (!user) {
        //     return res.json({ message: "Not register account" })
        // }
        //console.log(decoded.id)
        const query = `SELECT * From postgres.users WHERE id = '${decoded.id}'` 
     client.query(query,(err,result)=>{
            if(err)
            {
                return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
            }
           // console.log(result.rows)
            if(result.rowCount)
            {
                if(!roles.includes(result?.rows[0]?.role))
                {
                    return res.json({ message: "u are not authorized" })
                }
            }
            
            for (const rows of result.rows) {
                user.push(rows)
            }
           
           // console.log({resultsss:result.rows})
        })
      // console.log({users:user})
       req.user = user;
      setTimeout(()=>{return next()},100)  
        
      //  return next()
    } catch (error) {
        return res.json({ message: "Catch error" , err:error?.message })
    }
}
}

module.exports = {auth}