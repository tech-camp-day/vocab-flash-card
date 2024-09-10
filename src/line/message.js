const MESSAGE_LANG = {
  th: {
    HELLO: `สวัสดีครับ มาเล่นทายคำกันเถอะ! 
จะมีศัพท์ภาษาอังกฤษส่งให้ทุกวันตอน 6 โมงเย็น
แต่ถ้าจะเล่นตอนนี้พิมพ์ว่า "ขอศัพท์" ได้เลยครับ`,
    NOT_TEXT: 'ส่งสติ้กเกอร์มาเพื่อ?',
    START_ERROR: 'มีข้อผิดพลาดในการเริ่มต้น กรุณาลอง block แล้ว unblock บอทใหม่อีกครั้ง',
    GIVE_WORD: 'ขอศัพท์',
    ASK_WORD: 'คำว่า "{question}" แปลว่าอะไร?',
    SEE_SCORE: 'ดูคะแนน',
    STAT: 'คุณตอบถูก {correct}/{total} ครั้งใน 7 วันที่ผ่านมา',
    NO_ASSIGNED_WORD: "ยังไม่มีศัพท์ให้ทายครับ",
    HELP: 'ถ้าอยากเล่นตอนนี้พิมพ์ว่า "ขอศัพท์" หรือถ้าต้องการดูคะแนนพิมพ์ว่า "ดูคะแนน" ได้เลยครับ',
    CORRECT: 'ถูกต้อง',
    WRONG: 'ผิด',
    SHOW_ANSWER: 'คำว่า "{question}" แปลว่า "{answer}"',
    REPORT: 'สรุปคะแนนสัปดาห์ที่ผ่านมาของคุณ: {correct}/{total} คะแนน'
  },
  en: {
    HELLO: `Hello, let's play a word guessing game!
You will receive a Thai word every day at 6 PM.
But if you want to play now, type "Give me a word"`,
    NOT_TEXT: 'Why send a sticker?',
    START_ERROR: 'There was an error starting. Please try blocking and unblocking me again',
    GIVE_WORD: 'Give me a word',
    ASK_WORD: 'What does "{question}" mean?',
    SEE_SCORE: 'See score',
    STAT: 'You answered {correct}/{total} correctly in the past 7 days',
    NO_ASSIGNED_WORD: "There is no word to guess yet",
    HELP: 'If you want to play now, type "Give me a word" or if you want to see the score, type "See score"',
    CORRECT: 'Correct',
    WRONG: 'Wrong',
    SHOW_ANSWER: 'The word "{question}" means "{answer}"',
    REPORT: 'Your weekly score summary: {correct}/{total} points'
  }
};

module.exports = MESSAGE_LANG;
