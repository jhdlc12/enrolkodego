const express = require("express");
const router = express.Router();
const enrolment_controller = require("../controllers/auth_students");

router.post("/enroll", enrolment_controller.addStudent);
router.post("/login", enrolment_controller.loginAccount);
router.get("/updateform/:email", enrolment_controller.updateform);
router.post("/updateUser", enrolment_controller.updateUser);
router.get("/deleteUser/:email", enrolment_controller.deleteUser);
router.get("/enrolledStudents", enrolment_controller.return);
router.get("/logout", enrolment_controller.logoutAccount);
module.exports = router;
