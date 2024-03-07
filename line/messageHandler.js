const { reply } = require('./messageSender');
const {
  createUser,
  deleteUser,
  assignRandomVocab,
  getCurrentVocab,
  addScore,
  logHistory
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

  if (event.message.text === 'ขอศัพท์') {
    const { word } = assignRandomVocab(event.source.userId);
    reply(event, `"${word}" แปลว่าอะไร?`);
  }

  const currentVocab = getCurrentVocab(event.source.userId);

  if (!currentVocab) {
    reply(event, 'ยังไม่มีศัพท์ให้ทายครับ');
    return;
  }

  if (event.message.text === meaning) {
    reply(event, 'ถูกต้องครับ');
    addScore(event.source.userId, 1);
    logHistory(event.source.userId, vocabId, true);
  } else {
    reply(event, `ผิดครับ ${word} แปลว่า "${meaning}"`);
    logHistory(event.source.userId, vocabId, false);
  }

  reply(event, 'รอศัพท์ใหม่พรุ่งนี้นะครับ');
}

// todo: cron to assign new vocab everyday

module.exports = { handleEvent };
