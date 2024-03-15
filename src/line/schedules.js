const cron = require("node-cron");

const { assignRandomVocab, getNoAnswerPendingUsers } = require("../data/db");
const { send } = require("./messageSender");

/**
 * ส่งคำศัพท์ใหม่ให้กับผู้ใช้ที่ไม่มีคำศัพท์ค้างตอบอยู่
 */
function sendNewVocabToUsersWithoutAnswerPending() {
  console.log("sendNewVocabToUsersWithoutAnswerPending started!");
  const noAnswerPendingUsers = getNoAnswerPendingUsers();

  for (const user of noAnswerPendingUsers) {
    const { word } = assignRandomVocab(user.lineUserId);
    send(user.lineUserId, `"${word}" แปลว่าอะไร?`);
  }
}

cron.schedule("0 18 * * *", sendNewVocabToUsersWithoutAnswerPending, { timezone: "Asia/Bangkok" });
