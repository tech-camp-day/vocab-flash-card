const cron = require("node-cron");

const {
  assignRandomVocab,
  getNoAnswerPendingUsers,
  getWeeklyReportAllUsers,
} = require("../data/db");
const { send } = require("./messageSender");
const MESSAGE_LANG = require("./message");

/**
 * ส่งคำศัพท์ใหม่ให้กับผู้ใช้ที่ไม่มีคำศัพท์ค้างตอบอยู่
 */
function sendNewVocabToUsersWithoutAnswerPending() {
  console.log("sendNewVocabToUsersWithoutAnswerPending started!");
  const noAnswerPendingUsers = getNoAnswerPendingUsers();

  for (const { lineUserId, lang } of noAnswerPendingUsers) {
    const { word, meaning } = assignRandomVocab(lineUserId);
    const txt = MESSAGE_LANG[lang];
    const question = lang === "th" ? word : meaning;
    send(lineUserId, txt.ASK_WORD.replace("{question}", question));
  }
}

cron.schedule("0 18 * * *", sendNewVocabToUsersWithoutAnswerPending, {
  timezone: "Asia/Bangkok",
});

function sendWeeklyReport() {
  console.log("sendWeeklyReport started!");
  const report = getWeeklyReportAllUsers();

  for (const { lineUserId, lang, total, correct } of report) {
    const txt = MESSAGE_LANG[lang];
    send(
      lineUserId,
      txt.REPORT.replace("{correct}", correct).replace("{total}", total)
    );
  }
}

// cron every Sunday at 10am
cron.schedule("0 10 * * 0", sendWeeklyReport, {
  timezone: "Asia/Bangkok",
});
