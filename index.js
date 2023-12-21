const express = require("express")
const Bootstrap =require("./src/index.route.js")
const app = express()
//const path =require('path')
//const  fileURLToPath  =require( 'url')

//set directory dirname 
 //const _dirname = path.dirname(fileURLToPath(import.meta.url))
//dotenv.config({ path: path.join(_dirname, './config/.env') })
const dotenv =require('dotenv')
dotenv.config()

const port = process.env.LOCAL_PORT 
Bootstrap(express,app)
//ha5od date k taree5 w akarno be enhrda
//
// console.log( Date.parse("oct 25 10 "))
// console.log(new Date(2023,6,5,0,21))
//console.log(new Date().g())  
// let date = new  Date()
// console.log(Date.now())
// console.log(date.getDate()) 
//  console.log(Math.abs( date.getHours()-12)) 
// console.log(date.getMinutes())
//console.log(Date.now())
// let st = ""
// st = st.concat("11/3/2023"," ","5:0:33:22 PM")
// console.log(st)

// console.log(Date.parse('11/3/2023 9:51:33:22 PM'))
// console.log(Date.parse('11/3/2023 9:51:33:22 AM'))


// console.log(Date.parse('02:50'))

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})