const express = require('express');
const notificationService = require('../services/notification.service');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const foundNotification = await notificationService.getNotification(id);
    if (!foundNotification) {
      res.status(400).json({ message: `Notification ${id} doesn't exist` });
    } else {
      res.status(200).send(foundNotification);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err });
  }
});

router.get('/', async (req, res) => {
  try {
    const allNotifcations = await notificationService.getAllNotifications();
    res.status(200).send(allNotifcations);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNotification = await notificationService.deleteNotification(id);
    if (!deletedNotification.n === 0) {
      res.status(400).json({ message: `Notification ${id} not deleted` });
    } else {
      res.status(200).json({ message: `Notification ${id} was succesfully deleted` });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// update notification
router.post('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedNotification = await notificationService.updateNotification(id, req.body);
    if (updatedNotification.nModified === 0) {
      res.status(400).json({ message: `Notification ${id} not updated` });
    } else {
      res.status(200).send(updatedNotification);
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// create notification
router.post('/', async (req, res) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    res.status(200).send(notification);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
