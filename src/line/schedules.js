const cron = require("node-cron");

const {
  assignRandomVocab,
  getNoAnswerPendingUsers,
  getWeeklyReportAllUsers,
} = require("../data/db");
const { send } = require("./messageSender");

/**
 * ส่งคำศัพท์ใหม่ให้กับผู้ใช้ที่ไม่มีคำศัพท์ค้างตอบอยู่
 */
function sendNewVocabToUsersWithoutAnswerPending() {
  console.log("sendNewVocabToUsersWithoutAnswerPending started!");
  const noAnswerPendingUsers = getNoAnswerPendingUsers();

  for (const { lineUserId } of noAnswerPendingUsers) {
    const { word } = assignRandomVocab(lineUserId);
    send(lineUserId, `"${word}" แปลว่าอะไร?`);
  }
}

cron.schedule("0 18 * * *", sendNewVocabToUsersWithoutAnswerPending, {
  timezone: "Asia/Bangkok",
});

function sendWeeklyReport() {
  console.log("sendWeeklyReport started!");
  const report = getWeeklyReportAllUsers();

  for (const { lineUserId, total, correct } of report) {
    send(
      lineUserId,
      `สรุปคะแนนสัปดาห์ที่ผ่านมาของคุณ: ${correct}/${total} คะแนน`
    );
  }
}

// cron every Sunday at 10am
cron.schedule("0 10 * * 0", sendWeeklyReport, {
  timezone: "Asia/Bangkok",
});
