const dotenv =require('dotenv')
dotenv.config()
//const {pool} = require("pg")
const {Client} =require("pg")
// const pool = new pool({
//     connectionString:
// })

 
//kilany1 or kilany2 or kilany3
const client = new Client({
    host:process.env.DB_HOST,
    port:process.env.PORT,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DBNAME
})



//postgresql://umsrgtvtaegf6vxscbha:o5EJMvWjeyE0C79mDUeA26U2cmvdLL@bmvwgqd8v4agzcouc8pt-postgresql.services.clever-cloud.com:50013/bmvwgqd8v4agzcouc8pt


//local DB
//  const client = new Client({
//     host: "localhost", //"localhost",//process.env.HOST,
//     port:5433,//process.env.PORT,
//     user:"postgres",//process.env.USER,
//     password:"keko",//process.env.PASSWORD,
//     database:"postgres",//process.env.DB
// })

//render DB
// const client = new Client({
//     host:"dpg-cl59stk72pts739v80c0-a",//process.env.DB_LOCAL,//process.env.HOST,
//     port:5432,//process.env.PORT,
//     user:"redhat_user",//process.env.USER,
//     password:"EyRO3F1ghQn6MUy9hX5aftKDJuEL2ZEE",//process.env.PASSWORD,
//     database:"redhat",//process.env.DB
//     URL:"postgres://redhat_user:EyRO3F1ghQn6MUy9hX5aftKDJuEL2ZEE@dpg-cl59stk72pts739v80c0-a/redhat"
// })

// const client = new Client({
//     host:process.env.DB_HOST,
//     port:process.env.PORT,
//     user:process.env.DB_USERNAME,
//     password:process.env.DB_PASSWORD,
//     database:process.env.DB_DBNAME
// })

//hoss DB
// const client = new Client({
//    host:"localhost",//process.env.HOST,
//    port:5432,//process.env.PORT,
//    user:"postgres",//process.env.USER,
//    password:"2714",//process.env.PASSWORD,
//    database:"postgres",//process.env.DB
// })

module.exports = client