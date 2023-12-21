const { Router } = require ("express")
const   userController  = require('./Controller/user.js')
const router = Router()

router.get("/",userController.getUsers)
router.get('/all',userController.getUsers2)
router.get('/doctors',userController.getdoctors)

module.exports = router

