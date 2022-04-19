const express = require('express');
const notificationService = require('../services/notification.service');

const router = express.Router();

router.get(':/userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const userNotifications = await notificationService.getAllUserNotifications(userId);
    res.status(200).send(userNotifications);
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

module.exports = router;
