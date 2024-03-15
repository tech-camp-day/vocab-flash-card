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
 * จัดการกับเหตุการณ์ที่เข้ามา, ตรวจสอบประเภทของเหตุการณ์และส่งไปยังฟังก์ชันที่เหมาะสม
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

/**
 * จัดการกับเหตุการณ์ 'follow' ส่งข้อความทักทายและสร้างผู้ใช้ในฐานข้อมูล
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
function handleFollow(event) {
  reply(event, `สวัสดีครับ มาเล่นทายคำกันเถอะ! 
จะมีศัพท์ภาษาอังกฤษส่งให้ทุกวันตอน 6 โมงเย็น
แต่ถ้าจะเล่นตอนนี้พิมพ์ว่า "ขอศัพท์" ได้เลยครับ`);
  createUser(event.source.userId);
}

/**
 * จัดการกับเหตุการณ์ 'unfollow' ลบผู้ใช้และประวัติการตอบคำถามของพวกเขาออกจากฐานข้อมูล
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
function handleUnfollow(event) {
  deleteUser(event.source.userId);
}

/**
 * จัดการกับเหตุการณ์ 'message' 
 * หากข้อความไม่ใช่ข้อความประเภทข้อความ ตอบกลับด้วยข้อความ
 * หากผู้ใช้ไม่มีอยู่ในฐานข้อมูล ตอบกลับด้วยข้อความ
 * หากผู้ใช้ขอศัพท์ใหม่ กำหนดศัพท์ใหม่ให้กับผู้ใช้
 * หากผู้ใช้ตอบคำศัพท์ ตรวจสอบว่าคำตอบถูกหรือไม่ และตอบกลับด้วยข้อความ
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
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
    reply(event, 'ยังไม่มีศัพท์ให้ทายครับ', 'ถ้าอยากเล่นตอนนี้พิมพ์ว่า "ขอศัพท์" ได้เลยครับ');
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
}

// todo: history check

module.exports = { handleEvent };
