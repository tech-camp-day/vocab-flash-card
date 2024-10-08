const express = require('express');
const line = require('@line/bot-sdk');

const { handleEvent } = require('../line/messageHandler');

const router = express.Router();

const BOT_LANG = process.env.BOT_LANG || 'th';

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

router.post('/', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent(BOT_LANG)))
    .then((result) => res.json(result));
});

module.exports = router;
