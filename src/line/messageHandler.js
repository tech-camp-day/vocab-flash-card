const { reply, send } = require('./messageSender');
const {
  createUser,
  doesUserExist,
  deleteUser,
  assignRandomVocab,
  getCurrentVocab,
  correctAnswer,
  wrongAnswer,
  getWeeklyReport,
} = require('../data/db');
const MESSAGE_LANG = require('./message');

/**
 * จัดการกับเหตุการณ์ที่เข้ามา, ตรวจสอบประเภทของเหตุการณ์และส่งไปยังฟังก์ชันที่เหมาะสม
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
function handleEvent(lang) {
  const txt = MESSAGE_LANG[lang];

  return (event) => {
    switch (event.type) {
      case 'follow':
        handleFollow(event, txt, lang);
        break;
      case 'unfollow':
        handleUnfollow(event);
        break;
      case 'message':
        handleMessage(event, txt, lang);
        break;
      default:
        break;
    }
  }
}

/**
 * จัดการกับเหตุการณ์ 'follow' ส่งข้อความทักทายและสร้างผู้ใช้ในฐานข้อมูล
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
function handleFollow(event, txt, lang) {
  reply(event, txt.HELLO);
  createUser(event.source.userId, lang);
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
function handleMessage(event, txt, lang) {
  if (event.message.type !== 'text') {
    reply(event, txt.NOT_TEXT);
    return;
  }

  if (!doesUserExist(event.source.userId)) {
    reply(event, txt.START_ERROR);
    return;
  }

  if (event.message.text === txt.GIVE_WORD) {
    const { word, meaning } = assignRandomVocab(event.source.userId);
    const question = lang === 'th' ? word : meaning;
    reply(event, txt.ASK_WORD.replace('{question}', question));
    return;
  }

  if (event.message.text === txt.SEE_SCORE) {
    const { total, correct } = getWeeklyReport(event.source.userId);
    reply(event, txt.STAT.replace('{correct}', correct).replace('{total}', total));
    return;
  }

  const currentVocab = getCurrentVocab(event.source.userId);

  if (!currentVocab) {
    reply(event, txt.NO_ASSIGNED_WORD, txt.HELP);
    return;
  }

  const { word, meaning } = currentVocab;

  const question = lang === 'th' ? word : meaning;
  const answer = lang === 'th' ? meaning : word;

  if (event.message.text === answer) {
    reply(event, txt.correct);
    correctAnswer(event.source.userId);
  } else {
    reply(event, txt.WRONG, txt.SHOW_ANSWER.replace('{question}', question).replace('{answer}', answer));
    wrongAnswer(event.source.userId);
  }
}

module.exports = { handleEvent };
