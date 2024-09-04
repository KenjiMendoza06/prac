const asyncHandler = require("express-async-handler");
const Request = require("../models/request.model");

const createRequest = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { reason, type, startDate, endDate } = req.body;

  //! Validate the required fields
  if (!reason || !type || !startDate || !endDate) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  const requestExists = await Request.findOne({
    user: userId,
    startDate,
    endDate,
  })

  if (requestExists) {
    res.status(400);
    throw new Error("You already have a request for this date range");
  }

    // Create a new request
    const request = new Request({
      user: userId, // Link the request to the authenticated user
      reason,
      type,
      startDate,
      endDate,
    });
  
    // Save the request to the database
    await request.save();
  
    // Respond with the created request
    res.status(201).json(request);
  });

const getRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find().lean().exec();

  if (!requests.length) {
    res.status(404);
    throw new Error("No requests found");
  }

  res.status(200).json(requests);
});

const getRequestByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400);
    throw new Error("Request ID is required");
  }

  const request = await Request.findById(userId).lean().exec();

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  res.status(200).json(request);
});

const updateRequestByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400);
    throw new Error("User ID is required");
  }

  const request = await Request.findByIdAndUpdate(userId, req.body);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (type) request.type = type;
  if (startDate) request.startDate = startDate;
  if (endDate) request.endDate = endDate;
  if (reason) request.reason = reason;

  await request.save();

  res.status(200).json({
    message: `Request updated successfully`,
    _id: request._id,
    user: request.user,
    reason: request.reason,
    type: request.type,
    startDate: request.startDate,
    endDate: request.endDate,
    status: request.status,
  });
});

const deleteRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error("User ID is required");
  }

  const request = await Request.findByIdAndDelete(id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  res.status(200).json({
    message: `Request deleted successfully`,
  });
});

module.exports = {
  createRequest,
  getRequests,
  getRequestByUser,
  updateRequestByUser,
  deleteRequest,
};
