const db = require('better-sqlite3')('vocab-flash-card.db', { verbose: console.log });

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
    `)

  const createAllTables = db.transaction(() => {
    createVocabTable.run();
    createUserTable.run();
    createUserHistoryTable.run();
  });

  createAllTables();
};

initDb();

function createUser(lineUserId) {
  const createUser = db.prepare('insert into user (lineUserId) values (?)');
  createUser.run(lineUserId);
}

function deleteUser(lineUserId) {
  const deleteUserHistory = db.prepare('delete from userHistory where lineUserId = ?');
  const deleteUser = db.prepare('delete from user where lineUserId = ?');

  db.transaction(() => {
    deleteUserHistory.run(lineUserId);
    deleteUser.run(lineUserId);
  })();
}

function assignRandomVocab(lineUserId) {
  const selectRandomVocab = db.prepare('select id, word, meaning from vocabs order by random() limit 1');
  const updateCurrentVocab = db.prepare('update user set currentVocabId = ?, currentAnswered = false, currentCorrect = false where lineUserId = ?');

  const randomVocab = selectRandomVocab.get();
  updateCurrentVocab.run(randomVocab.id, lineUserId);

  return randomVocab;
}

function getCurrentVocab(lineUserId) {
  const selectCurrentVocab = db.prepare('select id, word, meaning from vocabs where id = (select currentVocabId from user where lineUserId = ?)');
  return selectCurrentVocab.get(lineUserId);
}

function logHistory(lineUserId, vocabId, correct) {
  const logHistory = db.prepare('insert into userHistory (lineUserId, vocabId, correct) values (?, ?, ?)');
  logHistory.run(lineUserId, vocabId, correct);
}

function addScore(lineUserId) {
  const addScore = db.prepare('update user set score = score + 1 where lineUserId = ?');
  addScore.run(lineUserId);
}

module.exports = { initDb, createUser, deleteUser, assignRandomVocab, getCurrentVocab, logHistory, addScore };
