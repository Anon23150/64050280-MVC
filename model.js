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


// รีดนมวัว
function processCow(code) {
    const animalsData = getAnimalsData(); 
    const cow = findAnimalById(code); 
    
    if (!cow || cow.type !== 'cow') { 
        return { success: false, message: 'ไม่พบรหัสนี้ในฐานข้อมูลหรือสัตว์ไม่ใช่วัว' };
    }
    const milkProduced = cow.age_year + cow.age_month;
    cow.liters_of_milk += milkProduced; 
    
    // มีโอกาส 5% ที่เต้าจะลดลง
    const chance = Math.random(); 
    let message = `รีดนมสำเร็จ: ${milkProduced.toFixed(2)} ลิตร`;

    if (cow.udders === 4 && chance < 0.05) { 
        cow.udders = 3; 
        message += ' (โชคร้ายจังวัวตัวนี้เต้าลดลง 1 เต้า)';
    }
    
    // เพิ่มจำนวนนมทั้งหมดที่รีดได้
    animalsData.total_liters_of_milk += milkProduced;

    // เปลี่ยนค่าวัวทีละตัว
    updateSingleCow(cow, animalsData);

    return { success: true, message: message };
}


// โอกาสเพิ่มเต้านม
function increaseUdder(code) {
    const animalsData = getAnimalsData();
    const index = animalsData.animals.findIndex(animal => animal.id === code); 

    if (index === -1 || animalsData.animals[index].type !== 'cow' || animalsData.animals[index].udders !== 3) {
        return { success: false, message: 'วัวตัวนี้ไม่สามารถเพิ่มเต้าได้ (ต้องมี 3 เต้าเท่านั้น)' };
    }

    const chance = Math.random();
    if (chance < 0.2) { 
        animalsData.animals[index].udders = 4; 
        updateAnimals(animalsData); 
        return { success: true, message: 'โชคดีจัง! วัวตัวนี้กลับมามี 4 เต้าแล้ว' };
    } else {
        return { success: false, message: 'เพิ่มเต้าไม่สำเร็จ' };
    }
}

// เปลี่ยนค่าในตัววัวทีละตัว
function updateSingleCow(cow, animalsData) {
    const index = animalsData.animals.findIndex(animal => animal.id === cow.id); 
    
    if (index !== -1) {
        animalsData.animals[index] = cow; 
        updateAnimals(animalsData);
    }
}

// เขียน Data ใหม่ ทับอันเก่า
function updateAnimals(animalsData) {
    console.log(animalsData.animals);
    fs.writeFileSync(dataFile, JSON.stringify(animalsData, null, 2));
}


// ดึงค่านมทั้งหมด
function getTotalMilk() {
    const data = fs.readFileSync(dataFile);
    const jsonData = JSON.parse(data);
    return jsonData.total_liters_of_milk; 
}

module.exports = { findAnimalById, processCow, getTotalMilk, increaseUdder };
