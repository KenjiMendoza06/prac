const express = require("express");
const {
  createRequest,
  getRequests,
  getRequestByUser,
  updateRequestByUser,
  deleteRequest,
} = require("../controllers/request.controller");
const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.get("/:id", getRequestByUser);
router.put("/:id", updateRequestByUser);
router.delete("/:id", deleteRequest);

module.exports = router;
