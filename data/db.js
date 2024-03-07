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
