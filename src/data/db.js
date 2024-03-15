const db = require("better-sqlite3")("./db/vocab-flash-card.db", {
  verbose: console.log,
});
const vocabs = require("./vocabs.json");

/**
 * กำหนดค่าเริ่มต้นให้ฐานข้อมูลโดยการสร้างตารางที่จำเป็นหากยังไม่มีอยู่
 */
const initDb = () => {
  const createVocabTable = db.prepare(`
      create table if not exists vocabs (
        id integer primary key autoincrement,
        word text not null,
        meaning text not null
      )
    `);

  const createUserTable = db.prepare(`
      create table if not exists user (
        lineUserId text primary key,
        currentVocabId integer,
        currentAnswered boolean default false,
        currentCorrect boolean default false,
        score integer default 0
      )
    `);

  const createUserHistoryTable = db.prepare(`
      create table if not exists userHistory (
        lineUserId text,
        vocabId integer,
        correct boolean,
        createdDate integer default current_timestamp,
        foreign key (lineUserId) references user(lineUserId),
        foreign key (vocabId) references vocabs(id)
      )
    `);

  const createAllTables = db.transaction(() => {
    createVocabTable.run();
    createUserTable.run();
    createUserHistoryTable.run();

    const insertVocab = db.prepare(
      "insert or ignore into vocabs (id, word, meaning) values (?, ?, ?)"
    );
    vocabs.forEach(({ id, word, meaning }) => {
      insertVocab.run(id, word, meaning);
    });
  });

  createAllTables();
};

initDb();

/**
 * สร้างผู้ใช้ใหม่ในฐานข้อมูล
 * @param {string} lineUserId - ไอดีผู้ใช้ของ Line
 */
function createUser(lineUserId) {
  const createUser = db.prepare("insert into user (lineUserId) values (?)");
  createUser.run(lineUserId);
}

/**
 * ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
 * @param {string} lineUserId - ไอดีผู้ใช้ของ Line
 * @returns {object|null} - วัตถุผู้ใช้งานถ้าพบ มิฉะนั้นเป็นค่า null
 */
function doesUserExist(lineUserId) {
  const selectUser = db.prepare(
    "select lineUserId from user where lineUserId = ?"
  );
  return selectUser.get(lineUserId);
}

/**
 * ลบผู้ใช้และประวัติการใช้งานของพวกเขาออกจากฐานข้อมูล
 * @param {string} lineUserId - ไอดีผู้ใช้ของ Line
 */
function deleteUser(lineUserId) {
  const deleteUserHistory = db.prepare(
    "delete from userHistory where lineUserId = ?"
  );
  const deleteUser = db.prepare("delete from user where lineUserId = ?");

  db.transaction(() => {
    deleteUserHistory.run(lineUserId);
    deleteUser.run(lineUserId);
  })();
}

/**
 * กำหนดคำศัพท์ที่สุ่มให้กับผู้ใช้
 * @param {string} lineUserId - ไอดีผู้ใช้ของ Line
 * @returns {object} - วัตถุคำศัพท์ที่กำหนดสุ่ม
 */
function assignRandomVocab(lineUserId) {
  const selectRandomVocab = db.prepare(
    "select id, word, meaning from vocabs order by random() limit 1"
  );
  const updateCurrentVocab = db.prepare(
    "update user set currentVocabId = ?, currentAnswered = false, currentCorrect = false where lineUserId = ?"
  );

  const randomVocab = selectRandomVocab.get();
  updateCurrentVocab.run(randomVocab.id, lineUserId);

  return randomVocab;
}

/**
 * ดึง lineUserId ของผู้ใช้ที่ไม่มีคำตอบที่รอดำเนินการหรือไม่มี current vocabId
 * @returns {Array} อาร์เรย์ของค่า lineUserId
 */
function getNoAnswerPendingUsers() {
  const selectNoAnswerPendingUsers = db.prepare(
    "select lineUserId from user where currentAnswered = true or currentVocabId is null"
  );
  return selectNoAnswerPendingUsers.all();
}

/**
 * ดึงคำศัพท์ปัจจุบันสำหรับผู้ใช้งาน
 * @param {string} lineUserId - ไอดีผู้ใช้งานของ Line
 * @returns {object|null} - วัตถุคำศัพท์ปัจจุบันถ้าพบ มิฉะนั้นเป็นค่า null
 */
function getCurrentVocab(lineUserId) {
  const selectCurrentVocab = db.prepare(
    "select word, meaning from vocabs where id = (select currentVocabId from user where lineUserId = ? and currentAnswered = false)"
  );
  return selectCurrentVocab.get(lineUserId);
}

/**
 * ผู้ใช้ตอบถูก อัปเดตคะแนนของผู้ใช้และบันทึกคำตอบที่ถูกต้องในประวัติการใช้งานของผู้ใช้
 * @param {string} lineUserId - ไอดีผู้ใช้ของ Line
 */
function correctAnswer(lineUserId) {
  const correctAnswer = db.prepare(
    "update user set currentCorrect = true, currentAnswered = true, score = score + 1 where lineUserId = ?"
  );
  const logHistory = db.prepare(
    "insert into userHistory (lineUserId, vocabId, correct) values (?, (select currentVocabId from user where lineUserId = ?), true)"
  );

  db.transaction(() => {
    correctAnswer.run(lineUserId);
    logHistory.run(lineUserId, lineUserId);
  })();
}

/**
 * ผู้ใช้ตอบผิด อัปเดตสถานะ currentCorrect ของผู้ใช้เป็น false และบันทึกคำตอบที่ผิดในประวัติการใช้งานของผู้ใช้
 * @param {string} lineUserId - ไอดีผู้ใช้ของ Line
 */
function wrongAnswer(lineUserId) {
  const wrongAnswer = db.prepare(
    "update user set currentCorrect = false, currentAnswered = true where lineUserId = ?"
  );
  const logHistory = db.prepare(
    "insert into userHistory (lineUserId, vocabId, correct) values (?, (select currentVocabId from user where lineUserId = ?), false)"
  );

  db.transaction(() => {
    wrongAnswer.run(lineUserId);
    logHistory.run(lineUserId, lineUserId);
  })();
}

module.exports = {
  initDb,
  createUser,
  doesUserExist,
  deleteUser,
  assignRandomVocab,
  getCurrentVocab,
  correctAnswer,
  wrongAnswer,
  getNoAnswerPendingUsers,
};
