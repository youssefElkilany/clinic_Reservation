const { Router } = require ("express")
const   reserveController  = require('./Controller/reservation.js')
const { auth } = require("../../middelware/Auth.js")
const roles = require("../../middelware/validation.js")
const router = Router()

router.get("/queues/:id",reserveController.doctorqueues)
router.get("/",reserveController.allReservation)
router.get("/view",auth(roles.roles.patient),reserveController.viewReservation)
router.get("/:doctorId",auth(roles.roles.patient),reserveController.avalaibleSlots)
router.post("/",auth(roles.roles.patient),reserveController.registerSlot)
router.put("/update",auth(roles.roles.patient),reserveController.updateReservation)
router.put("/cancel",auth(roles.roles.patient),reserveController.cancelReservation)
//router.get('/messages',auth(roles.roles.doctor),reserveController.doctormessages)
router.post("/messages",auth(roles.roles.doctor),reserveController.doctormessages)


module.exports = router





// const { Router } = require ("express")
// const   reserveController  = require('./Controller/reservation.js')
// const { auth } = require("../../middelware/Auth.js")
// const roles = require("../../middelware/validation.js")
// const router = Router()
//
// router.get("/view",auth(roles.roles.patient),reserveController.viewReservation)
// router.get("/:doctorId",auth(roles.roles.patient),reserveController.avalaibleSlots)
// router.post("/",auth(roles.roles.patient),reserveController.registerSlot)
//
//
//
// module.exports = router
//
