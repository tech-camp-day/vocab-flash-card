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
function reply(event, ...messages) {
  client.replyMessage({
    replyToken: event.replyToken,
    messages: messages.map((message) => ({ type: 'text', text: message })),
  });
}

/**
 * เริ่มส่งข้อความไปยังผู้ใช้
 * 
 * @param {Object} event - อ็อบเจ็กต์เหตุการณ์
 * @param {string} messages - ข้อความที่จะส่ง
 */
function send(event, ...messages) {
  client.pushMessage({
    to: event.source.userId,
    messages: messages.map((message) => ({ type: 'text', text: message })),
  });
}

module.exports = { reply, send };