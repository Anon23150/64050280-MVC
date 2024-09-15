const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const controller = require('./controller');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // รองรับ JSON

// แสดงฟอร์ม
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view.html');
});

// ส่งรหัสเพื่อตรวจสอบ
app.post('/submit-code', controller.submitCode);

// Route สำหรับแสดงน้ำนมทั้งหมด
app.get('/total', controller.getTotalMilk);

// Route สำหรับการรีดนม
app.post('/milk-cow', controller.milkCow);

// Route สำหรับการเพิ่มเต้า
app.post('/increase-udder', controller.increaseUdder);

app.post('/send-goat-back', controller.sendGoatBack);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    console.log('Click here to open: http://localhost:3000');
});
