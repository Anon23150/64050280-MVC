const model = require('./model');

// ตรวจชนิดของสัตว์แล้วก้ปั้น respons
function submitCode(req, res) {
    const code = parseInt(req.body.code, 10);
    const animal = model.findAnimalById(code);

    if (!animal) {
        return res.json({ success: false, message: 'ไม่พบรหัสนี้ในฐานข้อมูล' });
    }

    if (animal.type === 'goat') {
        return res.json({
            success: true,
            type: 'goat',
            message: 'แพะ! ',
        });
    }

    if (animal.type === 'cow') {
        if (animal.udders === 4) {
            return res.json({
                success: true,
                type: 'cow',
                udders: 4,
                message: 'วัวมี 4 เต้า, สามารถรีดนมได้!',
            });
        } else if (animal.udders === 3) {
            return res.json({
                success: true,
                type: 'cow',
                udders: 3,
                message: 'วัวนี้มี 3 เต้า, ไม่สามารถรีดนมได้',
            });
        }
    }
}

// รีดนม
function milkCow(req, res) {
    const code = parseInt(req.body.code, 10);
    const result = model.processCow(code); 
    return res.json(result); 
}

// โอกาสที่เต้าจะเพิ่ม 
function increaseUdder(req, res) {
    const code = parseInt(req.body.code, 10);
    const result = model.increaseUdder(code); 
    return res.json(result); 
}

// ส่งแพะไปภูเขาแบบปลอมๆ
function sendGoatBack(req, res) {
    const code = parseInt(req.body.code, 10);
    const animal = model.findAnimalById(code);

    if (!animal || animal.type !== 'goat') {
        return res.json({ success: false, message: 'ไม่พบแพะในระบบ' });
    }

    return res.json({ success: true, message: 'ไล่แพะกลับภูเขาสำเร็จ!' });
}

// ดึงค่านมรวมทั้งหมด
const  getTotalMilk = (req, res) => {
    const totalMilk = model.getTotalMilk();
    return res.json({ totalMilk });
  };


module.exports = { submitCode, milkCow ,getTotalMilk ,increaseUdder , sendGoatBack  };
