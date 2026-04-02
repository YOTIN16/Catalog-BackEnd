const API_URL = 'http://localhost:3000/api';
let currentCustomer = null;

// ให้โหลดข้อมูลของรางวัลทั้งหมดมาแสดงทันทีที่เปิดหน้าเว็บ
window.onload = () => {
    loadInitialRewards();
};

// ดึงข้อมูลรางวัลทั้งหมดมาโชว์หน้าลูกค้า
async function loadInitialRewards() {
    try {
        const res = await fetch(`${API_URL}/all-rewards`);
        const rewards = await res.json();
        renderRewardCards(rewards);
    } catch (e) {
        console.error("ไม่สามารถโหลดของรางวัลเริ่มต้นได้", e);
    }
}

function switchRole(role) {
    const custSec = document.getElementById('section-customer');
    const mgrSec = document.getElementById('section-manager');
    const btnCust = document.getElementById('btn-customer');
    const btnMgr = document.getElementById('btn-manager');

    if (role === 'customer') {
        custSec.classList.remove('hidden-section');
        mgrSec.classList.add('hidden-section');
        btnCust.classList.add('active-role');
        btnMgr.classList.remove('active-role');
        // ถ้ากลับมาหน้าลูกค้า ก็โหลดของรางวัลมาอัปเดตด้วย
        loadInitialRewards(); 
    } else {
        custSec.classList.add('hidden-section');
        mgrSec.classList.remove('hidden-section');
        btnMgr.classList.add('active-role');
        btnCust.classList.remove('active-role');
        loadAllManagerData();
    }
}

async function loadAllManagerData() {
    await Promise.all([loadManagerCustomers(), loadManagerRewards()]);
}

// ----------------- ส่วนของลูกค้า -----------------

async function searchByPhone() {
    const phoneInput = document.getElementById('search-phone').value.trim();
    if (!phoneInput) return alert("กรุณาระบุเบอร์โทรศัพท์");
    
    try {
        const res = await fetch(`${API_URL}/dashboard/phone/${phoneInput}`);
        const data = await res.json();
        if (res.ok) {
            currentCustomer = data.profile;
            document.getElementById('customer-result').classList.remove('hidden');
            document.getElementById('c-name').innerText = currentCustomer.name;
            document.getElementById('c-points').innerText = currentCustomer.points;
            
            // ใช้รายการรางวัลที่ส่งมาจาก API (เผื่อมีการอัปเดต)
            renderRewardCards(data.rewards);
        } else {
            document.getElementById('customer-result').classList.add('hidden');
            currentCustomer = null; // รีเซ็ตลูกค้า
            alert(data.error || "ไม่พบข้อมูลสมาชิก");
        }
    } catch (e) { 
        alert("เชื่อมต่อ Server ไม่ได้"); 
    }
}

function renderRewardCards(rewards) {
    const container = document.getElementById('reward-list-container');
    if (!rewards || rewards.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1;">ยังไม่มีของรางวัลในระบบ</p>`;
        return;
    }
    
    container.innerHTML = rewards.map(r => `
        <div class="reward-card">
            <div>
                <div style="font-weight:600; font-size:1.1rem; color:var(--accent);">${r.rewards_name}</div>
                <div style="color:var(--gold); font-weight:600; margin-top:4px;">${r.points_required} แต้ม</div>
            </div>
            <button onclick="redeemReward(${r.points_required})" class="btn btn-dark" style="width:100%; margin-top:10px;">
                แลกรางวัล
            </button>
        </div>
    `).join('');
}

async function redeemReward(points) {
    if (!currentCustomer) return alert("กรุณาค้นหาสมาชิกก่อนทำการแลกรางวัล");
    if (currentCustomer.points < points) return alert("แต้มของคุณไม่เพียงพอ");
    
    if (!confirm(`ยืนยันการใช้ ${points} แต้มเพื่อแลกของรางวัล?`)) return;
    
    try {
        const res = await fetch(`${API_URL}/redeem`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer_id: currentCustomer.customer_id, points_used: points })
        });
        if (res.ok) { 
            alert("แลกรางวัลสำเร็จ!"); 
            searchByPhone(); // โหลดข้อมูลแต้มใหม่
        }
    } catch (e) { alert("เกิดข้อผิดพลาดในการเชื่อมต่อ"); }
}

// ----------------- ส่วนผู้จัดการ (จัดการลูกค้า) -----------------

async function loadManagerCustomers() {
    try {
        const res = await fetch(`${API_URL}/New_customers`);
        const result = await res.json();
        document.getElementById('manager-customer-table').innerHTML = result.data.map(c => `
            <tr>
                <td style="font-weight:600;">${c.name}</td>
                <td style="color:var(--text-muted);">${c.phone}</td>
                <td style="text-align:center; font-weight:600; font-size:1.1rem; color:var(--accent);">${c.points}</td>
                <td style="text-align:center; display:flex; gap:8px; justify-content:center;">
                    <button onclick='openEditCustomerModal(${JSON.stringify(c)})' class="btn btn-sm btn-yellow">แก้ไข</button>
                    <button onclick="deleteCustomer(${c.customer_id})" class="btn btn-sm btn-red">ลบ</button>
                </td>
            </tr>
        `).join('');
    } catch (e) { console.error(e); }
}

function openAddCustomerModal() {
    document.getElementById('cust-modal-title').innerText = "เพิ่มลูกค้าใหม่";
    document.getElementById('edit-customer-id').value = "";
    document.getElementById('in-cust-name').value = "";
    document.getElementById('in-cust-phone').value = "";
    document.getElementById('in-cust-points').value = 0;
    openModal('customer-modal');
}

function openEditCustomerModal(c) {
    document.getElementById('cust-modal-title').innerText = "แก้ไขข้อมูลลูกค้า";
    document.getElementById('edit-customer-id').value = c.customer_id;
    document.getElementById('in-cust-name').value = c.name;
    document.getElementById('in-cust-phone').value = c.phone;
    document.getElementById('in-cust-points').value = c.points;
    openModal('customer-modal');
}

async function saveCustomer() {
    const id = document.getElementById('edit-customer-id').value;
    const name = document.getElementById('in-cust-name').value;
    const phone = document.getElementById('in-cust-phone').value;
    const pts = document.getElementById('in-cust-points').value;
    
    if (!name || !phone) return alert("กรุณาระบุชื่อและเบอร์โทรศัพท์");
    
    const method = id ? 'PATCH' : 'POST';
    const url = id ? `${API_URL}/customers/${id}` : `${API_URL}/put_customers`;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, points: Number(pts) })
        });
        if (res.ok) { closeModal('customer-modal'); loadManagerCustomers(); }
    } catch (e) { alert("บันทึกข้อมูลไม่สำเร็จ"); }
}

async function deleteCustomer(id) {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบลูกค้าท่านนี้?")) return;
    try {
        const res = await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
        if (res.ok) { alert("ลบข้อมูลลูกค้าสำเร็จ"); loadManagerCustomers(); }
    } catch (e) { alert("ลบข้อมูลไม่สำเร็จ"); }
}

// ----------------- ส่วนผู้จัดการ (จัดการของรางวัล) -----------------

async function loadManagerRewards() {
    try {
        const res = await fetch(`${API_URL}/all-rewards`); 
        const rewards = await res.json();
        document.getElementById('manager-reward-table').innerHTML = rewards.map(r => `
            <tr>
                <td style="text-align:center; color:var(--text-muted);">${r.rewards_id}</td>
                <td style="font-weight:600;">${r.rewards_name}</td>
                <td style="text-align:center; font-weight:600; color:var(--gold); font-size:1.1rem;">${r.points_required}</td>
                <td style="text-align:center; display:flex; gap:8px; justify-content:center;">
                    <button onclick='openEditRewardModal(${JSON.stringify(r)})' class="btn btn-sm btn-yellow">แก้ไข</button>
                    <button onclick="deleteReward(${r.rewards_id})" class="btn btn-sm btn-red">ลบ</button>
                </td>
            </tr>
        `).join('');
    } catch (e) { console.error(e); }
}

function openAddRewardModal() {
    document.getElementById('reward-modal-title').innerText = "เพิ่มรางวัลใหม่";
    document.getElementById('modal-reward-id').value = "";
    document.getElementById('in-reward-name').value = "";
    document.getElementById('in-reward-points').value = "";
    openModal('reward-modal');
}

function openEditRewardModal(r) {
    document.getElementById('reward-modal-title').innerText = "แก้ไขข้อมูลของรางวัล";
    document.getElementById('modal-reward-id').value = r.rewards_id;
    document.getElementById('in-reward-name').value = r.rewards_name;
    document.getElementById('in-reward-points').value = r.points_required;
    openModal('reward-modal');
}

async function saveReward() {
    const id = document.getElementById('modal-reward-id').value;
    const name = document.getElementById('in-reward-name').value;
    const pts = document.getElementById('in-reward-points').value;
    
    if (!name || pts === "") return alert("กรุณาระบุชื่อรางวัลและคะแนนที่ต้องใช้");

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/rewards/${id}` : `${API_URL}/rewards`;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rewards_name: name, points_required: Number(pts) })
        });
        if (res.ok) { closeModal('reward-modal'); loadManagerRewards(); }
    } catch (e) { alert("บันทึกข้อมูลไม่สำเร็จ"); }
}

async function deleteReward(id) {
    if (!confirm("ต้องการลบรางวัลรหัส " + id + " หรือไม่?")) return;
    try {
        const res = await fetch(`${API_URL}/rewards/${id}`, { method: 'DELETE' });
        if (res.ok) { alert("ลบรายการรางวัลสำเร็จ"); loadManagerRewards(); }
    } catch (e) { alert("ลบข้อมูลไม่สำเร็จ"); }
}