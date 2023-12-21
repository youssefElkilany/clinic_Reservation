const client = require ("../../../../DB/Connection.js")


 const getUsers = async(req,res,next)=>{

    let id = 10
    client.query(`Select * from postgres.users WHERE id = '${id}'`,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }
        return  res.json({message:"done",result:result})
    })
  
}

const getdoctors = (req,res,next)=>{
    let role = 'doctor'
    client.query(`Select * from postgres.users WHERE role = '${role}'`,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }
        return  res.json({message:"done",result:result.rows})
    })
}


const getUsers2 = async(req,res,next)=>{

    // let id = 10
     client.query(`Select * from postgres.users`,(err,result)=>{
         if(err)
         {
             return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
         }
         return  res.json({message:"done",result:result.rows})
     })
   
 }


module.exports= {
    getUsers,getUsers2,getdoctors
}