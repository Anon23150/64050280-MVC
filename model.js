const fs = require('fs');
const path = require('path');
const dataFile = path.join(__dirname, 'data.json');


function getAnimalsData() {
    const data = fs.readFileSync(dataFile);
    return JSON.parse(data);
}


function findAnimalById(id) {
    const animalsData = getAnimalsData();
    return animalsData.animals.find(animal => animal.id == id);
}

function processCow(code) {
    const animalsData = getAnimalsData(); 
    const cow = findAnimalById(code); 
    
    if (!cow || cow.type !== 'cow') { 
        return { success: false, message: 'ไม่พบรหัสนี้ในฐานข้อมูลหรือสัตว์ไม่ใช่วัว' };
    }

    // คำนวณปริมาณน้ำนม = จำนวนปี + จำนวนเดือน
    const milkProduced = cow.age_year + cow.age_month;
    cow.liters_of_milk += milkProduced; // เพิ่มปริมาณน้ำนมที่รีดได้ในวัวตัวนั้น
    
    // มีโอกาส 5% ที่เต้านมจะลดลงเหลือ 3
    const chance = Math.random(); // สุ่มโอกาส
    let message = `รีดนมสำเร็จ: ${milkProduced.toFixed(2)} ลิตร`;

    if (cow.udders === 4 && chance < 0.50) { // 5% โอกาสที่เต้าจะลดลง
        cow.udders = 3; // ลดเต้านมเหลือ 3
        message += ' (โชคร้ายจังวัวตัวนี้เต้าลดลง 1 เต้า)';
    }
    
    // อัปเดตปริมาณน้ำนมรวมทั้งหมด
    animalsData.total_liters_of_milk += milkProduced;

    // อัปเดตข้อมูลในไฟล์
    updateAnimals(animalsData); // ส่งข้อมูลทั้งหมดกลับไปอัปเดตไฟล์

    return { success: true, message: message };
}

// ฟังก์ชันเพื่ออัปเดตข้อมูล (รวมถึง total_liters_of_milk)
function updateAnimals(animalsData) {
    fs.writeFileSync(dataFile, JSON.stringify(animalsData, null, 2));
}

// ฟังก์ชันเพิ่มเต้านม
function increaseUdder(code) {
    const animalsData = getAnimalsData();
    const cow = findAnimalById(code); // เรียกใช้ findAnimalById เพื่อค้นหาวัว

    if (!cow || cow.type !== 'cow' || cow.udders !== 3) {
        return { success: false, message: 'วัวตัวนี้ไม่สามารถเพิ่มเต้าได้ (ต้องมี 3 เต้าเท่านั้น)' };
    }

    const chance = Math.random();
    if (chance < 0.2) { // 20% โอกาส
        cow.udders = 4; // เพิ่มเต้าเป็น 4
        updateAnimals(animalsData); // อัปเดตข้อมูลในไฟล์
        return { success: true, message: 'โชคดีจัง! วัวตัวนี้กลับมามี 4 เต้าแล้ว' };
    } else {
        return { success: false, message: 'เพิ่มเต้าไม่สำเร็จ' };
    }
}

function updateSingleCow(cow, animalsData) {
    const existingCow = findAnimalById(cow.id); // ค้นหาวัวด้วย findAnimalById
    
    if (existingCow) {
        Object.assign(existingCow, cow); // อัปเดตข้อมูลใน existingCow ด้วย cow ใหม่
        updateAnimals(animalsData); // อัปเดตข้อมูลทั้งหมดในไฟล์ JSON
    }
}


// ฟังก์ชันดึงจำนวนน้ำนมรวม
function getTotalMilk() {
    const data = fs.readFileSync(dataFile);
    const jsonData = JSON.parse(data);
    return jsonData.total_liters_of_milk; // ดึงค่าจากคีย์ total_liters_of_milk
}

module.exports = { findAnimalById, processCow, getTotalMilk, increaseUdder };
