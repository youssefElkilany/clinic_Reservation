const client = require("../../../../DB/Connection.js")


const allSlots = (req,res,next)=>{

    const query = `SELECT * FROM postgres.slots`
    client.query(query,(err,result)=>{

        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }
        if(!result.rowCount)
        {
            return res.json({message:"no slots found"})
        }

        return res.json({result:result.rows})
    })
}


const viewSlots = (req,res,next)=>{

    const {doctorid} = req.params
    const query = `SELECT * FROM postgres.slots WHERE doctorid = ${doctorid}`

    client.query(query,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }
        if(!result.rowCount)
        {
           // console.log("no rows")
            return res.json({message:"userId not found"})
        }
        return res.json(result.rows)
    })
}

const viewDoctorSlots = (req,res,next)=>{

    const {userid} = req.params
    const query = `SELECT * FROM postgres.slots WHERE doctorid = ${userid}`
    let availableslots = []
    client.query(query,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }
        if(!result.rowCount)
        {
            console.log("no rows")
            return res.json({message:"userId not found"})
        }
        result.rows.forEach(rows => {
            if(Date.parse(rows.fulldate) >=  Date.now())
            {
                availableslots.push(rows)
            }
        })


        return res.json(availableslots)
    })
}


//fadel 23ml validation 3la date
//w eno myd5lsh nafs date => h3ml column y3ml store lel date kolo w ykarno bel input el
// const addSlots = (req,res,next)=>{
//
//     //m7tag a8yr date mn index 0 to 1
//     // from 1 AM to 11 59 PM
//     let {date,hours,doctorName,time} = req.body
//     const doctorId = req.user[0].id
//   hours =  hours.split(':')
//    // hours = hours.format('HH:MM:SS') || hours.format('HH:MM')
//    //fadel validation 3la seconds
//     if(!((hours[0]>0 && hours[0]<=12) && (hours[1]>=0 && hours[1]<= 59)))
//     {
//         return res.json({message:"Monthh is not valid"})
//     }
//   hours =  hours.join(':')
//     // let AM = "AM"
//     // let PM = "PM"
//     console.log({hours:hours})
//     let role = "doctor"
// console.log("d5lt")
//     console.log({doctorId,date,hours,doctorName})
//     const query = `Select * FROM users WHERE id = ${doctorId} AND role = '${role}' `
//
//     client.query(query,(err,result)=>{
//         if(err)
//         {
//             return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
//         }
//         // console.log({results:result.rows})
//         // console.log({rows:result.rowCount})
//         if(!result.rowCount)
//         {
//             console.log("no rows")
//             return res.json({message:"userId not found"})
//         }
//         //mmkn a3mlha b kaza taree2a w 23ml split aw concat
//         // mmkn  23mlha store fe variable wa7ed fel database w akarbo beeh b3deen
//     time = time.toUpperCase()
//     if(time.toUpperCase() != ('AM' && 'PM'))
//     {
//         return next( new Error("enter right night "))
//     }
//         let fulldate = ""
//        fulldate = fulldate.concat(date," ",hours," ",time)
//
//       console.log(fulldate)
//       //m7tageen n3ml check hena 3la time sa7 wla l2
//     if(Date.parse(fulldate) <=  Date.now())
//     {
//         return next(new Error("date is not valid"))
//     }
//
//         const query2 = `INSERT INTO slots(date,hour,time,doctorId,doctorName,fulldate) VALUES('${date}','${hours}','${time}',${doctorId},'${result.rows[0].name}','${fulldate}')`
//
//         client.query(query2,(err,result)=>{
//         if(err)
//         {
//             return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
//         }
//
//         return res.json({message:"slot added succssessfully",result:result})
//
//         })
//
//     })
//
//
// }

const addSlots = (req,res,next)=>{

    //m7tag a8yr date mn index 0 to 1
    // from 1 AM to 11 59 PM
    let {date,hours,doctorName,time} = req.body
    const doctorId = req.user[0].id
    hours =  hours.split(':')
    // hours = hours.format('HH:MM:SS') || hours.format('HH:MM')
    //fadel validation 3la seconds
    if(!((hours[0]>0 && hours[0]<=24) && (hours[1]>=0 && hours[1]<= 59)))
    {
        return res.json({message:"hourss is not valid"})
    }
    hours =  hours.join(':')
    // let AM = "AM"
    // let PM = "PM"
    console.log({hours:hours})
    let role = "doctor"
    console.log("d5lt")
    console.log({doctorId,date,hours,doctorName})
    const query = `Select * FROM postgres.users WHERE id = ${doctorId} AND role = '${role}' `

    client.query(query,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
        }
        // console.log({results:result.rows})
        // console.log({rows:result.rowCount})
        if(!result.rowCount)
        {
            console.log("no rows")
            return res.json({message:"userId not found"})
        }

        // time = time.toUpperCase()
        // if(time.toUpperCase() !=  'PM' && time.toUpperCase() != 'AM') //3mlt ta8yeer henaa ===========
        // {
        //     return next( new Error("enter right night "))
        // }
        let fulldate = ""
        fulldate = fulldate.concat(date," ",hours)

        console.log(fulldate)
        //m7tageen n3ml check hena 3la time sa7 wla l2
        if(Date.parse(fulldate) <=  Date.now())
        {
            return next(new Error("date is not valid"))
        }//elgdeed hena
        const query5 = `SELECT * from postgres.slots WHERE fulldate = '${fulldate}' AND doctorid = ${doctorId}`
        client.query(query5,(err,result)=>{
            if(err)
            {
                return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
            }
            if(result.rowCount)
            {
                return res.json({message:" there is slot with the same date"})
            }

        })
        let slotid = 1
        let key = 1
        // auto increment id
//         const query1 = `SELECT * from postgres.slots`
//   client.query(query1,(err,result)=>{
//     if(err)
//     {
//         return res.json({message: "err",err,errMessage:err.message,stack:err.stack}) 
//     }
//     if(!result.rowCount)
//     {
//        slotid=1
//        key = 1
//     }
//     if(result.rowCount)
//     {
//         for (const rows of result.rows) {
           
//             if(slotid == rows.id)
//             {
//                // console.log("ddddd")
//                 slotid = rows.id + 1
               
//             }
//             if(key == rows.key)
//             {
                
//                 key = rows.key + 1
               
//             }
            
//         }
//     }
// //})
console.log({slotid,date,hours,doctorId})
        //m7tag 23ml check 3la eno myd5lsh nafs wa2t mrteen
         const query2 = `INSERT INTO postgres.slots(date,hour,doctorId,doctorName,fulldate) VALUES('${date}','${hours}',${doctorId},'${result.rows[0].name}','${fulldate}')`

        client.query(query2,(err,result)=>{
            if(err)
            {
                return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
            }
            if(!result.rowCount)
            {
                //console.log("no rows")
                return res.json({message:"userId not found"})
            }

            return res.json({message:"slot added succssessfully",result:result})

        })

   // })
    })

}

const deleteslots = (req,res,body)=>{

  //  const {key} = req.body

    const query = `DELETE from postgres.slots`
    client.query(query,(err,result)=>{
if(err)
{
    return res.json({message: "err",err,errMessage:err.message,stack:err.stack})
}
return res.json({message:"slots deleted"})   
    })
    
}



const addSlots2 = (req,res,next)=>{

    //m7tag a8yr date mn index 0 to 1  
    // from 1 AM to 11 59 PM
    let {date,hours,doctorName} = req.body
    const doctorId = req.user[0].id
    let AM = "AM"
    let PM = "PM"
    // date = date.format('MM/DD/YYYY')
    let role = "doctor"
console.log("d5lt")
    console.log({doctorId,date,hours,doctorName})
    const query = `Select * FROM users WHERE id = ${doctorId} AND role = '${role}' `

    client.query(query,(err,result)=>{
        if(err)
        {
            return res.json({message: "err",err,errMessage:err.message,stack:err.stack}) 
        }
        // console.log({results:result.rows})
        // console.log({rows:result.rowCount})
        if(!result.rowCount)
        {
            console.log("no rows")
            return res.json({message:"userId not found"})
        }
     hours = hours.split(':')
    //   date = date.split('/')
    //   let Month = date[0]-1
    //   console.log(date[0],date[1],date[2])
      
    if(Date.parse(date) <=  Date.now()) 
    {
        return next(new Error("date is not valid"))
    }
        // if(date[2] < checkdate.getFullYear())
        // {
        //     return res.json({message:"Year is not valid"})
        // }
        
        // if(date[1] < checkdate.getDate())
        // {
        //     if(date[2] <= checkdate.getFullYear())
        //     {
        //         if(date[0] <= checkdate.getMonth()+1)
        //         {
        //             return res.json({message:"Day is not valid"})
        //         }
        //     }
            
        // }  
        // if(date[0] < checkdate.getMonth()+1)
        // {
        //     if(date[2] <= checkdate.getFullYear())
        //     {
        //         return res.json({message:"Month is not valid"})
        //     }
        //    // return res.json({message:"Month is not valid"})
        // }
        
        // if(date <= Date.now())
        // {
        //     return res.json({message:"date is not valid"})
        // }
        // if(AM)
        // {
        //     if(hours[0] != 10)
        //     {
        //        hours[0] -= 12
        //     }
        // }
        // if(PM)
        // {
        //     hours[0] += 12
        // }
    //     let h = hours[0]+2
    //     // year  Month day 
    //   let checkhours = new Date(date[2],Month,date[1],h,hours[1],0)
    //     console.log(checkhours) 
    //     if(checkhours < new Date())
    //     {
    //         return res.json({message:"hours is not valid"}) 
    //     }
        // if(Date.parse(hours)< Math.abs(new Date().getHours()-12))
        // {
        //     return res.json({message:"hours is not valid"})
        // }
    //})

        // const query2 = `INSERT INTO Slots(date,hours,doctorName) VALUES(${date},${hours},${result.rows[0].name})`
        
        // client.query(query2,(err,result)=>{
        // if(err)
        // {
        //     return res.json({message: "err",err,errMessage:err.message,stack:err.stack}) 
        // }

        // return res.json({message:"slot added succssessfully",result:result})

        // })
        
    })

    
}


module.exports = {
    addSlots,viewSlots,viewDoctorSlots,deleteslots,allSlots
}