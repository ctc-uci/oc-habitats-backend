/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const sectionSegmentRouter = require('./routes/section.segment.router');
const monitorLogRouter = require('./routes/monitorLog.router');
const speciesRouter = require('./routes/species.router');
const notificationRouter = require('./routes/notification.router');
const emailRouter = require('./routes/nodemailer.router');
const adminInviteRouter = require('./routes/adminInvite.router');
const numbersRouter = require('./routes/numbers.router');

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

app.use(
  express.urlencoded({ extended: true }),
  express.json(),
  cors({
    origin: `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`,
    credentials: true,
  }),
);

app.use(cookieParser());

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/forms', formRouter);

app.use(sectionSegmentRouter);
app.use(monitorLogRouter);
app.use('/species', speciesRouter);
app.use('/notification', notificationRouter);

app.use('/adminInvite', adminInviteRouter);
app.use('/nodemailer', emailRouter);
app.use(dashboardRouter);

app.use('/numbers', numbersRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
