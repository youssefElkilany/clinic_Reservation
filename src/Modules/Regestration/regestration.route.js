const { Router } = require ("express")
const   authController  = require('./Controller/regestration.js')
const roles = require("../../middelware/validation.js")
const val = require("./regestration.validation.js")
const router = Router()


router.post("/",roles.validation(val.signup),authController.signUp)

router.post("/login",roles.validation(val.login),authController.login)

module.exports = router

