// ดึง Element แต่ละหน้ามาเก็บไว้
const homePage = document.getElementById('homePage');
const registerPage = document.getElementById('registerPage');
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');

// ฟังก์ชันสำหรับเปลี่ยนหน้า
function showPage(pageToShow) {
    homePage.classList.add('hidden');
    registerPage.classList.add('hidden');
    loginPage.classList.add('hidden');
    dashboardPage.classList.add('hidden');
    
    pageToShow.classList.remove('hidden');
}

// ตั้งค่าปุ่มไปหน้าลงทะเบียนและล็อกอิน
document.getElementById('btnGoRegister').addEventListener('click', () => showPage(registerPage));
document.getElementById('btnGoLogin').addEventListener('click', () => showPage(loginPage));

// ตั้งค่าปุ่มกลับหน้าแรก
document.querySelectorAll('.btnBack').forEach(btn => {
    btn.addEventListener('click', () => showPage(homePage));
});
// ==========================================
// ส่วนของการลงทะเบียน (ยิง API Register)
// ==========================================
document.getElementById('btnSubmitRegister').addEventListener('click', () => {
    const data = {
        email: document.getElementById('regEmail').value,
        first_name: document.getElementById('regFirstName').value,
        last_name: document.getElementById('regLastName').value,
        organization: document.getElementById('regOrg').value,
        phone: document.getElementById('regPhone').value,
        address: document.getElementById('regAddress').value
    };

    // แก้ไข URL ตรงบรรทัดนี้ให้เป็น /register
    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('ลงทะเบียนสำเร็จ สามารถล็อกอินได้เลย');
            showPage(homePage);
        } else {
            alert('เกิดข้อผิดพลาด: ' + result.message);
        }
    })
    .catch(error => alert('ระบบมีปัญหา: ' + error));
});

// ==========================================
// ส่วนของการล็อกอิน (ยิง API Login)
// ==========================================
document.getElementById('btnSubmitLogin').addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;

    fetch('http://localhost:3000/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // ถ้ายิง API สำเร็จ เอาชื่อมาแสดงและเปลี่ยนไปหน้าแดชบอร์ด
            document.getElementById('welcomeText').innerText = 'ยินดีต้อนรับคุณ ' + result.user.first_name + ' ' + result.user.last_name;
            showPage(dashboardPage);
        } else {
            alert('เข้าสู่ระบบไม่สำเร็จ: ' + result.message);
        }
    })
    .catch(error => alert('ระบบมีปัญหา: ' + error));
});

// ปุ่มออกจากระบบ
document.getElementById('btnLogout').addEventListener('click', () => {
    document.getElementById('loginEmail').value = '';
    showPage(homePage);
});