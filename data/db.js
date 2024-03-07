const db = require('better-sqlite3')('vocab-flash-card.db', { verbose: console.log });

/**
 * กำหนดค่าเริ่มต้นให้ฐานข้อมูลโดยการสร้างตารางที่จำเป็นหากยังไม่มีอยู่
 */
const initDb = () => {
    const createVocabTable = db.prepare(`
      create table if not exists vocabs (
      
      )
    `);

    const createUserTable = db.prepare(`
      create table if not exists user (

      )
    `);

    const createUserHistoryTable = db.prepare(`
      create table if not exists userHistory (

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
