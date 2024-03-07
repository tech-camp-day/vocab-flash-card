# Vocab Flash Card

ทายคำศัพท์ผ่าน LINE bot

## Installation

1. Clone the repository: `git clone https://github.com/yourusername/expense-memo.git`
2. Navigate to the project directoryt directory: `cd expense-memo`
3. Install dependencies: `npm install`

## Setting up LINE bot

1. สร้างไลน์บอทใหม่ที่ [LINE Developers Console](https://developers.line.biz/console/).
2. นำแอปพลิเคชันไปติดตั้งบนบริการคลาวด์ใดก็ได้และตั้งค่า webhook URL เป็น `{your-host-name}/webhook/line`.
3. รับ channel access token และ channel secret จาก LINE Developers Consoles มาใส่ Environment variables.
```
CHANNEL_ACCESS_TOKEN=your_channel_access_token
CHANNEL_SECRET=your_channel_secret
```
4. เริ่มต้นแอปพลิเคชันโดยรัน `npm start` ในเทอร์มินอล
