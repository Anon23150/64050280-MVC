const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const controller = require('./controller');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

// แสดงฟอร์ม
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view.html');
});

// ส่งรหัสไปหาสัตว์ในฟาร์ม
app.post('/submit-code', controller.submitCode);

// ดึงค่านมวัวทั้งหมด
app.get('/total', controller.getTotalMilk);

// สั่งรีดนม
app.post('/milk-cow', controller.milkCow);

// เรียกฟังค์ชั่นที่ทำให้วัวมีโอกาสเพิ่มเต้า
app.post('/increase-udder', controller.increaseUdder);

// เรียกส่งแพะกลับ
app.post('/send-back-goat', controller.sendGoatBack);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('Click here to open: http://localhost:3000');
});
