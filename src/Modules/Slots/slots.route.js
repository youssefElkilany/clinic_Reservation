const { Router } = require ("express")
const   slotsController  = require('./Controller/slots.js')
const { auth } = require("../../middelware/Auth.js")
const roles = require("../../middelware/validation.js")
const validation = require("../../middelware/validation.js")
const val = require("./slots.validation.js")
const router = Router()

router.get("/",slotsController.allSlots)

router.delete("/",slotsController.deleteslots)
router.get("/:doctorid",slotsController.viewSlots)
router.post("/",roles.validation(val.addSlots),auth(roles.roles.doctor),slotsController.addSlots)
router.get('/doctorslots/:userid',auth(roles.roles.patient),slotsController.viewDoctorSlots)



module.exports = router

