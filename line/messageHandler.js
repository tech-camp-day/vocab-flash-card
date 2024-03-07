const { reply, send } = require('./messageSender');
const {
  createUser,
  doesUserExist,
  deleteUser,
  assignRandomVocab,
  getCurrentVocab,
  correctAnswer,
  wrongAnswer,
} = require('../data/db');

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
  reply(event, `สวัสดีครับ มาเล่นทายคำกันเถอะ! 
จะมีศัพท์ภาษาอังกฤษส่งให้ทุกวันตอน 6 โมงเย็น
แต่ถ้าจะเล่นตอนนี้พิมพ์ว่า "ขอศัพท์" ได้เลยครับ`);
  createUser(event.source.userId);
}

function handleUnfollow(event) {
  deleteUser(event.source.userId);
}

function handleMessage(event) {
  if (event.message.type !== 'text') {
    reply(event, 'ส่งสติ้กเกอร์มาเพื่อ?');
  }

  if (!doesUserExist(event.source.userId)) {
    reply(event, 'มีข้อผิดพลาดในการเริ่มต้น กรุณาลอง block แล้ว unblock บอทใหม่อีกครั้ง');
    return;
  }

  if (event.message.text === 'ขอศัพท์') {
    const { word } = assignRandomVocab(event.source.userId);
    reply(event, `"${word}" แปลว่าอะไร?`);
    return;
  }

  const currentVocab = getCurrentVocab(event.source.userId);

  if (!currentVocab) {
    reply(event, 'ยังไม่มีศัพท์ให้ทายครับ');
    return;
  }

  const { word, meaning } = currentVocab;

  if (event.message.text === meaning) {
    reply(event, 'ถูกต้องครับ');
    correctAnswer(event.source.userId);
  } else {
    reply(event, 'ผิดครับ', `${word} แปลว่า "${meaning}"`);
    wrongAnswer(event.source.userId);
  }

  send(event, 'รอศัพท์ใหม่พรุ่งนี้นะครับ');
}

// todo: cron to assign new vocab everyday
// todo: history check

module.exports = { handleEvent };
