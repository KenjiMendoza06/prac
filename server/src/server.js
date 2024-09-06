import 'dotenv/config'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import express from "express"
import logger from './logger.js'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import userRoute from "./routes/user.route.js"
import { errorHandler } from './middlewares/error.middleware.js'

const PORT = process.env.PORT || 8000;
const app = express()

//! Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser());
const morganFormat = `:method :url :status :res[content-length] - :response-time ms`
app.use(helmet());
app.use(morgan(morganFormat, {stream: {write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
app.use(cors());

import crypto from 'crypto';
const randomHex = crypto.randomBytes(16).toString('hex');
console.log(randomHex);

//! Routes
app.use("/api/v1/users", userRoute)

//! Error Handler
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})


