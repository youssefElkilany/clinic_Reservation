const client = require("../../../../DB/Connection.js")
const { sendMsg, reciveMsg } = require("../../../../rabbitmq/rabbit.js")







const avalaibleSlots = (req,res,next)=>{

    //id bta3 doctor wel available slots bta3to
    const {doctorId} = req.params // lma ydoos 3la doctor mmkn 23mlha lma yktb esmo ytl3 w 23ml esm unique
    // const {userId} = req.user[0].id

    let avalaibleSlots = []
    const query = `Select * FROM postgres.slots WHERE doctorid = ${doctorId}`
    client.query(query,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }

        if(!result.rowCount)
        {
            return next(new Error("no slots found"))
        }
        console.log(new Date())
        //console.log(result.rows[0].fulldate)
        for (const rows of result.rows) {
            if(Date.parse(rows.fulldate) >  Date.now() ) //n5zn date kamel fe column
            {
                console.log(rows.fulldate)
                //  console.log(rows.fulldate)
                avalaibleSlots.push(rows)
                // console.log({avalaibleSlots})
            }
        }
        //console.log({avalaibleSlots2:avalaibleSlots})
        return res.json({message:"done",avalaibleSlots})
    })


}

const registerSlot = (req,res,next)=>{
    //mmkn ageeb doctor id mn slot id
    const {doctorId,slotId,doctorName,keys} = req.body
    const userId = req.user[0].id
    console.log(userId)
    let doctor = 'doctor'
    let status = 'created'
    let content = `reservation is ${status} by ${req.user[0].email}`

//m7tag 23ml check en mafeesh fulldate == fulldate 3shan hyb2a etneen 7agzeen fe nafs elwa2t bs lw doctor tany tmam
    const query = `SELECT * FROM postgres.slots WHERE key = ${keys}`

    client.query(query,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }
        console.log({rows:result.rows})
      //  console.log(result.rows[0].slotid)
        if(!result.rowCount)
        {
            return next(new Error("no slots found"))
        }//======================================
        console.log("gg")//****  mmkn 23ml check 3la en slot lesa fe wa2t w heya cancelled mn 7ad tany => bs keda msh h3ml keys unique
        if((Date.parse(result.rows[0]?.fulldate) < Date.now()) || result.rows[0]?.fulldate == null)
        {
            return next(new Error("slot is already out of date"))
        }
        //return res.json({message:"done",result:result.rows})
        //b3ml check en doctor mawgood
        const query2 = `SELECT id FROM postgres.users WHERE id = ${result.rows[0].doctorid} And role = '${doctor}' `

        client.query(query2,(err,result)=>{
            if(err)
            {
                return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
            }
            // console.log({rowsss:result.rowCount})
            if(!result.rowCount)
            {
                return next(new Error("no slots found"))
            }


        })
    })
        const query6 = `SELECT * from postgres.reservations WHERE keys = ${keys}`
        client.query(query6,(err,result)=>{
            if(err)
            {
                return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
            }

            if(result.rowCount)
            {
                console.log({reservation:result.rows})
                result.rows.forEach(rows => {
                    console.log("gowa")
                    if( (rows.status == 'created' || rows.status == 'updated') )
                    {
                        console.log("gowa condition")
                        return next(new Error("slot is already registered "))
                        //return res.json("slot is already registered ")
                    }
                });
            }
        })
       
    //     let id=1
    //     const query1 = `SELECT * from postgres.reservations`
    //     client.query(query1,(err,result)=>{
    //       if(err)
    //       {
    //           return res.json({message: "err",err,errMessage:err.message,stack:err.stack}) 
    //       }
    //       if(!result.rowCount)
    //       {
    //          id=1
            
    //       }
    //       if(result.rowCount)
    //       {
    //           for (const rows of result.rows) {
                 
    //               if(id == rows.id)
    //               {
                      
    //                   id = rows.id + 1
                     
    //               }
                  
    //           }
    //       }
    //   })
        
    //})  /////
    
//hasheel unique keys mn reservation w 23ml query check => en keys lw mawgood menha bs cancelled yb2a tmam mmkn 7ad tany ye7gzha
// lw cancelled n8yr rakam keys
const query5 = `SELECT * FROM postgres.slots WHERE key = ${keys}`

client.query(query5,(err,result)=>{

console.log(result.rows[0].doctorname)
console.log({doctorid:result.rows[0]?.doctorid})
            const query3 = `INSERT INTO postgres.reservations(slotid,patientid,doctorid,doctorname,fulldate,status,keys) VALUES(${result.rows[0].slotId},${userId},${result.rows[0]?.doctorid},'${result.rows[0].doctorname}','${result.rows[0].fulldate}','${status}',${keys})`
           // console.log(result.rows[0].slotId,userId,result.rows[0]?.doctorid,result.rows[0].doctorname,result.rows[0].fulldate,status)
            client.query(query3,(err,result)=>{
                if(err)
            {
                
                return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
            }
            if(!result.rowCount)
            {
                return next(new Error("no slots found"))
            }

      //sending message to queue
let docId = result.rows[0].doctorid.toString()
console.log({docId})
sendMsg({queueName:docId,msg:content})
//         console.log(content)

        return res.json({message:"reservation done"})   

             })


        // const query4 =  `INSERT INTO messages(content,doctorid) VALUES('${content}',${result.rows[0].doctorid})`
        // client.query(query4,(err,result)=>{
        //     if(err)
        //     {
        //         return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        //     }
        //     return res.json({message:"reservation done"})
        // })
        
        
    })

   

}

const allReservation = async(req,res,next)=>{

    const query = `SELECT * FROM postgres.reservations `

    client.query(query,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }
        if(!result.rowCount)
        {
            return next(new Error("no reservation found"))
        }
        return res.json({message:"done",result:result.rows})
    })

}


//get reservation
const viewReservation = async(req,res,next)=>{

    const userId = req.user[0].id
    let user = 'patient'

    // const query = `SELECT * FROM users WHERE id = ${userId} AND role ${user}`

    // client.query(query,(err,result)=>{
    //     if(err)
    //     {
    //         return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
    //     }
    //     if(!result.rowCount)
    //     {
    //         return next(new Error("no reservation found"))
    //     }
    //     return res.json({message:"done",result:result.rows})

    // })

    const query = `SELECT * FROM postgres.reservations WHERE patientid = ${userId} `

    client.query(query,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }
        if(!result.rowCount)
        {
            return res.json({message:"no reservation found"})
            // return next(new Error("no reservation found"))
        }
        return res.json({message:"done",result:result.rows})
    })

}



const updateReservation = (req,res,next)=>{
    let {keys,id} = req.body //id =>registrationID ,keys =>slot w registration
    const userId = req.user[0].id
    const userEmail = req.user[0].email
    let status = 'updated'
    let content = `reservation is ${status} by ${userEmail}`

    const query1 = `SELECT * from postgres.reservations WHERE id = ${id}`
    client.query(query1,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }

        if(!result?.rowCount)
        {
            return next(new Error("no reservation found"))
        }
        if((Date.parse(result?.rows[0]?.fulldate) < Date.now()) || result?.rows[0]?.fulldate == null)
        {
            return next(new Error("registration is already out of date"))
        }
    })



    const query = `SELECT * FROM postgres.slots WHERE key = ${keys} `

    client.query(query,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }

        if(!result?.rowCount)
        {
            return next(new Error("no reservation found"))
        }

        if((Date.parse(result?.rows[0]?.fulldate) < Date.now()) || result?.rows[0]?.fulldate == null)
        {
            return next(new Error("slot is already out of date"))
        }



//})

        const query2 = `SELECT * from postgres.reservations WHERE keys = ${keys}`
        client.query(query2,(err,result)=>{
            if(err)
            {
                return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
            }

            if(result.rowCount)
            {
                console.log({reservation:result.rows})
                result.rows.forEach(rows => {
                    console.log("gowa")
                    console.log(rows.patientid, userId)
                    if( rows.status == 'cancelled' )
                    {
                        return next(new Error("slot is already cancelled "))
                    }
                    else if((rows.status != 'created' || rows.status != 'updated') && rows.patientid != userId)
                    {
                        return next(new Error("slot is already registered "))
                    }
                });
            }
        })
//bageeb result mn slots w a3dl name
        console.log("ehh")

// 3ayz 23ml check en lw 7ad 3amal update eno yd5l keys 7ad wa5dha ablo en ttl3lo error

        const query3 = `UPDATE postgres.reservations
SET keys=${keys}, doctorid = ${result.rows[0].doctorid}, slotid = '${result.rows[0].slotId}', status = '${status}'
WHERE id = ${id} AND patientid = ${userId};`;
        console.log(result.rows[0].slotId,userId,result.rows[0].doctorid,result.rows[0].doctorname,result.rows[0].fulldate,status)
        client.query(query3,(err,result)=>{
            if(err)
            {
                if(err.code == 23505)
                {
                    return next(new Error("duplicate key"))
                }
                return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
            }
            if(!result.rowCount)
            {
                return next(new Error("no slots found"))
            }
            console.log("gg")

        })
        let docId = result.rows[0].doctorid.toString()
        console.log({docId})
        //after query4 result of slots
        // const query4 =  `INSERT INTO messages(content,doctorid)  VALUES('${content}',${result.rows[0].doctorid})`
        // client.query(query4,(err,result)=>{
        //     if(err)
        //     {
        //         return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        //     }
        //      //sending message to queue
        // sendMsg({queueName:docId,msg:content})
        //     return res.json({message:"reservation updated"})
        // })
       //  sending message to queue
        sendMsg({queueName:docId,msg:content})
            return res.json({message:"reservation updated"})
       
       
    })
   
}



const cancelReservation = (req,res,next)=>{
    let {id} = req.body
    const userId = req.user[0].id
    const userEmail = req.user[0].email
    let status = 'cancelled'
    let content = `reservation is ${status} by ${userEmail}`

    const query1 = `SELECT * from postgres.reservations WHERE id = ${id}`
    client.query(query1,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }
        if(!result.rowCount)
        {
            return next(new Error("no reservation found"))
        }
        if((Date.parse(result.rows[0]?.fulldate) < Date.now()) || result.rows[0]?.fulldate == null)
        {
            return next(new Error("slot is already out of date"))
        }
//})

//const query3 = `UPDATE reservations SET status = '${status}' WHERE id = ${id},patientid = ${userId}`
        const query3 = `UPDATE postgres.reservations
SET  status = '${status}'
WHERE id = ${id} AND patientid = ${userId};`;
        console.log(status,id,userId)
        client.query(query3,(err,result)=>{
            if(err)
            {
                return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
            }
            if(!result.rowCount)
            {
                return next(new Error("no slots found"))
            }




        })
        let docId = result.rows[0].doctorid.toString()
        console.log({docId})
         //sending message to queue
         sendMsg({queueName:docId,msg:content})
        // const query4 =  `INSERT INTO messages(content,doctorid)  VALUES('${content}',${result.rows[0].doctorid})`
        // client.query(query4,(err,result)=>{
        //     if(err)
        //     {
        //         return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        //     }
        //     return res.json({message:"reservation cancelled"})

        // })
        
        return res.json({message:"reservation cancelled"})
       
    })

}


const doctorqueues = async(req,res,next)=>{
    const {id} = req.params
    const msgg = await reciveMsg({queueName:id})
    console.log(msgg)
//     return res.json(`messages = ${msgg}`)
// reciveMsg({ queueName: id }).then((msgg) => {
//     res.json(`messages = ${msgg.msgg}`);
//   });
setTimeout(()=>{
    return res.json({msgg})
},2000)


}


const doctormessages = (req,res,next)=>{
    const {id}=req.body

    const query = `SELECT * from messages WHERE doctorid = ${id}`

    client.query(query,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }
        if(!result.rowCount)
        {
            return next(new Error("no messages found"))
        }
        return res.json({message:"done",result:result.rows})
    })
}



module.exports = {
    avalaibleSlots,registerSlot,viewReservation,updateReservation,cancelReservation,doctormessages,allReservation,doctorqueues
}


// const client = require("../../../../DB/Connection.js")
//
//
//
//
//
//
//
// const avalaibleSlots = (req,res,next)=>{
//
//     //id bta3 doctor wel available slots bta3to
//     const {doctorId} = req.params // lma ydoos 3la doctor mmkn 23mlha lma yktb esmo ytl3 w 23ml esm unique
//    // const {userId} = req.user[0].id
//
//     let avalaibleSlots = []
//     const query = `Select * FROM slots WHERE doctorid = ${doctorId}`
//     client.query(query,(err,result)=>{
//         if(err)
//         {
//             return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
//         }
//
//         if(!result.rowCount)
//         {
//             return next(new Error("no slots found"))
//         }
//      console.log(new Date())
//      //console.log(result.rows[0].fulldate)
//         for (const rows of result.rows) {
//             if(Date.parse(rows.fulldate) >  Date.now() ) //n5zn date kamel fe column
//             {
//                 console.log(rows.fulldate)
//               //  console.log(rows.fulldate)
//                avalaibleSlots.push(rows)
//               // console.log({avalaibleSlots})
//             }
//         }
//         //console.log({avalaibleSlots2:avalaibleSlots})
//         return res.json({message:"done",avalaibleSlots})
//     })
//
//
// }
//
// const registerSlot = (req,res,next)=>{
//     //mmkn ageeb doctor id mn slot id
//         const {doctorId,slotId,doctorName,keys} = req.body
//         const userId = req.user[0].id
//         console.log(userId)
//         let doctor = 'doctor'
//         let status = 'created'
//
//
//         const query = `SELECT * FROM slots WHERE key = ${keys}`
//
//         client.query(query,(err,result)=>{
//             if(err)
//             {
//                 return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
//             }
//             console.log({rows:result.rowCount})
//             if(!result.rowCount)
//             {
//                 return next(new Error("no slots found"))
//             }
//             console.log("gg")
//             if((Date.parse(result.rows[0]?.fulldate) < Date.now()) || result.rows[0]?.fulldate == null)
//             {
//                 return next(new Error("slot is already out of date"))
//             }
//             //return res.json({message:"done",result:result.rows})
//             const query2 = `SELECT id FROM users WHERE id = ${result.rows[0].doctorid} And role = '${doctor}' `
//
//             client.query(query2,(err,result)=>{
//                 if(err)
//             {
//                 return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
//             }
//            // console.log({rowsss:result.rowCount})
//             if(!result.rowCount)
//             {
//                 return next(new Error("no slots found"))
//             }
//
//
//             })
//
//             const query3 = `INSERT INTO reservations(slotid,patientid,doctorid,doctorname,fulldate,status,keys) VALUES(${result.rows[0].slotId},${userId},${result.rows[0].doctorid},'${result.rows[0].doctorname}','${result.rows[0].fulldate}','${status}',${keys})`
//             console.log(result.rows[0].slotId,userId,result.rows[0].doctorid,result.rows[0].doctorname,result.rows[0].fulldate,status)
//             client.query(query3,(err,result)=>{
//                 if(err)
//             {
//                 if(err.code == 23505)
//                 {
//                     return next(new Error("duplicate key"))
//                 }
//                 return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
//             }
//             if(!result.rowCount)
//             {
//                 return next(new Error("no slots found"))
//             }
//
//             return res.json({message:"done",result})
//
//             })
//
//
//         })
//
//
//
//     }
//
//
//
//
// // y7ot doctorId wel slotId wel status eno 3ml register
// const registerSlot2 = (req,res,next)=>{
// //mmkn ageeb doctor id mn slot id
//     const {doctorId,slotId,doctorName,keys} = req.body
//     const {userId} = req.user[0].id
//
//
//     const query = `Select slotId from slots where slotId = ${slotId}`
//     client.query(query,(err,result)=>{
//         if(err)
//         {
//             return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
//         }
//         if(!result.rowCount)
//         {
//             return next(new Error("no slots found"))
//         }
//     })
//
//     const query2 = `Select doctorId from slots where doctorId = ${doctorId} AND doctorName = ${doctorName}`
//
//     client.query(query2,(err,result)=>{
//         if(err)
//         {
//             return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
//         }
//
//     })
// }
//
// const viewReservation = async(req,res,next)=>{
//
//     const userId = req.user[0].id
//     let user = 'patient'
//
//     // const query = `SELECT * FROM users WHERE id = ${userId} AND role ${user}`
//
//     // client.query(query,(err,result)=>{
//     //     if(err)
//     //     {
//     //         return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
//     //     }
//     //     if(!result.rowCount)
//     //     {
//     //         return next(new Error("no reservation found"))
//     //     }
//     //     return res.json({message:"done",result:result.rows})
//
//     // })
//
//     const query = `SELECT * FROM reservations WHERE patientid = ${userId} `
//
//     client.query(query,(err,result)=>{
//         if(err)
//         {
//             return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
//         }
//         if(!result.rowCount)
//         {
//             return next(new Error("no reservation found"))
//         }
//         return res.json({message:"done",result:result.rows})
//     })
//
// }
//
//
//
// module.exports = {
//     avalaibleSlots,registerSlot,viewReservation
// }