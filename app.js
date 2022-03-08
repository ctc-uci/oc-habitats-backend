const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const sectionSegmentRouter = require('./routes/section.segment.router');
const monitorLogRouter = require('./routes/monitorLog.router');
const speciesRouter = require('./routes/species.router');

const userRouter = require('./routes/user.router');
const { authRouter, verifyToken } = require('./routes/auth.router');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI, {
  // useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  cors({
    origin: `${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`,
    credentials: true,
  }),
);

app.use(
  express.urlencoded({ extended: true }),
  express.json(),
  cors({ credentials: true, origin: true }),
);

app.use(cookieParser());

app.use('/users', userRouter);
// TODO remove
app.use('/test', [verifyToken, userRouter]);
app.use('/auth', authRouter);

app.use(sectionSegmentRouter);
app.use(monitorLogRouter);

app.use('/species', speciesRouter);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
