const line = require('@line/bot-sdk');

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

/**
 * ส่งข้อความตอบกลับ
 *
 * @param {Object} event - อ็อบเจ็กต์เหตุการณ์
 * @param {string} messages - ข้อความที่จะส่ง
 */
function reply(event, messages) {
  client.replyMessage({
    replyToken: event.replyToken,
    messages: [{
      type: 'text',
      text: messages
    }],
  });
}

module.exports = { reply };