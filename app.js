/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');

const sectionSegmentRouter = require('./routes/section.segment.router');
const monitorLogRouter = require('./routes/monitorLog.router');
const speciesRouter = require('./routes/species.router');
const notificationRouter = require('./routes/notification.router');
const emailRouter = require('./routes/nodemailer.router');
const adminInviteRouter = require('./routes/adminInvite.router');
const numbersRouter = require('./routes/numbers.router');
const reportRouter = require('./routes/report.router');
const userRouter = require('./routes/user.router');
const dashboardRouter = require('./routes/dashboard.router');
const { authRouter } = require('./routes/auth.router');
const formRouter = require('./routes/form.router');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const origin =
  process.env.NODE_ENV === 'production' ? `${process.env.REACT_APP_HOST}` : 'http://localhost:3000';

app.use(
  express.urlencoded({ extended: true }),
  express.json(),
  cors({
    origin,
    credentials: true,
  }),
);

app.use(cookieParser());

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/forms', formRouter);

app.use(sectionSegmentRouter);
app.use(monitorLogRouter);
app.use(reportRouter);
app.use('/species', speciesRouter);
app.use('/notification', notificationRouter);

app.use('/adminInvite', adminInviteRouter);
app.use('/nodemailer', emailRouter);
app.use(dashboardRouter);

app.use('/numbers', numbersRouter);

// Adds SSL in production
if (process.env.NODE_ENV === 'production') {
  // Add Helmet middleware for HTTP Strict Transport Security
  app.use(helmet.hsts());

  // Set SSL certs
  const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
  };
  https.createServer(options, app).listen(443);
} else {
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}
