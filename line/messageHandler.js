const { reply } = require('./messageSender');

/**
 * จัดการกับเหตุการณ์ที่เข้ามา
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
function handleEvent(event) {
  switch (event.type) {
    case 'follow':
      handleFollow(event);
      break;
    case 'unfollow':
      handleUnfollow(event);
      break;
    case 'message':
      handleMessage(event);
      break;
    default:
      break;
  }
}

function handleFollow(event) {
  reply(event, 'สวัสดีครับ มาเล่นทายคำกันเถอะ! จะมีศัพท์ภาษาอังกฤษส่งให้ทุกวันตอน 6 โมงเย็น แต่ถ้าจะเล่นตอนนี้พิมพ์ว่า "ขอศัพท์" ได้เลยครับ');
  // todo create user 
}

function handleUnfollow(event) {
  console.log(JSON.stringify(event, null, 2));
  // todo delete user and history
}

function handleMessage(event) {
  if (event.message.type !== 'text') {
    reply('ส่งสติ้กเกอร์มาเพื่อ?');
  }

  if (event.message.text === 'ขอศัพท์') {
    // todo send word
  }

  // todo check answer, tell user to wait for tommorow, update score
}

module.exports = { handleEvent };
