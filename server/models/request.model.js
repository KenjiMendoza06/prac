const mongoose = require("mongoose")

const RequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  reason: {
    type: String,
    required: [true, "Reason is required"],
  },
  type: {
    type: String,
    required: [true, "Type of leave is required"],
    enum: ["Vacation Leave with Pay", "Vacation Leave without Pay", "Sick Leave", "Maternity Leave", "Emergency Leave", "Work From Home", "Others"]
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  status: {
    type: String,
    enum: ["Pending", "Approved by Manager", "Approved by Head Manager", "Approved by HR", "Rejected by Manager", "Rejected by Head Manager", "Rejected by HR"],
    default: "Pending"
  }
})

const Request = mongoose.model("Request", RequestSchema)

module.exports = Request