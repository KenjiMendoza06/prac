const express = require("express");
const { getUsers, createUser, getUser, updateUser, deleteUser } = require("../controllers/user.controller");
const router = express.Router();

router.post("/", createUser),
router.get("/", getUsers),
router.get("/:id", getUser),
router.put("/:id", updateUser),
router.delete("/:id", deleteUser)

module.exports = router;