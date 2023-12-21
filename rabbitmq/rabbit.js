//lw cloud ageeb client w a7oto fel=> amqlib.connect("henaaa")
const amqlib = require("amqplib")



const sendMsg =async ({queueName,msg}={})=>{
    const connection = await amqlib.connect("amqp://localhost")
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName,{durable:false})
    channel.sendToQueue(queueName,Buffer.from(msg))
    console.log(`msg = ${msg}`)
    setTimeout(()=>{
        // connection.close()
        // process.exit(0)
    },500)
}

const reciveMsg = async({queueName}={})=>{
   

    
    let msgg = []
    const connection = await amqlib.connect("amqp://localhost")
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName,{durable:false})
   console.log(`waiting for msg in queue ${queueName}`)
   setTimeout(()=>{
    channel.consume(queueName,msg =>{
        msgg.push(msg.content.toString())
        console.log(`msggg = ${msgg}`)
        console.log(`recieved`,msg.content.toString())
       },{noAck:true})
   },1000)
   
   setTimeout(()=>{
    console.log(`message from outside ${msgg}`)
   // connection.close()
    //process.exit(0)
    
},1100)
return msgg
}

//sendMsg()
//reciveMsg()

//publisher el howa kol patient byb3t 3la queueName
//queueName htb2a b esm doctor wel msg htb2a feeha content
//consumer el howa doctor

module.exports = {sendMsg,reciveMsg}