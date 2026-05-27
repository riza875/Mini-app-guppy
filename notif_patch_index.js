// ============================================================
// PASTE KODE INI DI DALAM index.html (Mini App Telegram)
// Taruh di dalam script module, setelah db sudah diinisialisasi
// ============================================================

// Fungsi cek & tampilkan notifikasi dari admin
async function checkAdminNotifikasi() {
  try {
    const { collection, query, orderBy, limit, getDocs, doc, getDoc, setDoc } = 
      await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

    // Ambil notifikasi terbaru
    const notifSnap = await getDocs(
      query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(1))
    );
    if(notifSnap.empty) return;

    const notif = { id: notifSnap.docs[0].id, ...notifSnap.docs[0].data() };

    // Cek apakah user sudah lihat notifikasi ini
    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'guest';
    const seenKey = `notifSeen_${userId}`;
    const lastSeen = localStorage.getItem(seenKey);
    if(lastSeen === notif.id) return; // sudah pernah lihat

    // Tampilkan popup notifikasi
    showNotifPopup(notif);

    // Tandai sudah dilihat
    localStorage.setItem(seenKey, notif.id);
  } catch(e) {
    console.log('Notifikasi error:', e);
  }
}

function showNotifPopup(notif) {
  const typeColor = {
    info: '#3b82f6',
    success: '#22c55e',
    warning: '#fbbf24',
    promo: '#a855f7'
  };
  const typeIcon = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    promo: '🎁'
  };

  const color = typeColor[notif.type] || '#3b82f6';
  const icon = typeIcon[notif.type] || 'ℹ️';

  // Buat overlay popup
  const overlay = document.createElement('div');
  overlay.id = 'notifOverlay';
  overlay.style.cssText = `
    position:fixed;top:0;left:0;right:0;bottom:0;
    background:rgba(0,0,0,0.7);z-index:99999;
    display:flex;align-items:center;justify-content:center;
    padding:20px;animation:fadeIn 0.3s ease;
  `;

  overlay.innerHTML = `
    <style>
      @keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
      @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
      #notifCard { animation: slideUp 0.3s ease; }
    </style>
    <div id="notifCard" style="
      background:#111418;border:2px solid ${color};
      border-radius:16px;padding:24px;max-width:340px;width:100%;
      text-align:center;position:relative;
    ">
      <div style="font-size:40px;margin-bottom:12px">${icon}</div>
      <div style="
        display:inline-block;padding:4px 12px;border-radius:20px;
        background:${color}20;color:${color};border:1px solid ${color};
        font-size:12px;margin-bottom:12px;
      ">${(notif.type || 'info').toUpperCase()}</div>
      <h3 style="color:#f1f5f9;font-size:18px;margin-bottom:10px;font-family:Arial,sans-serif">
        ${notif.title}
      </h3>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;font-family:Arial,sans-serif;margin-bottom:20px">
        ${notif.message}
      </p>
      <button onclick="document.getElementById('notifOverlay').remove()" style="
        background:${color};color:white;border:none;
        padding:12px 32px;border-radius:8px;font-size:14px;
        font-weight:bold;cursor:pointer;width:100%;font-family:Arial,sans-serif;
      ">OK, MENGERTI</button>
    </div>
  `;

  document.body.appendChild(overlay);
  
  // Tutup jika klik di luar
  overlay.addEventListener('click', function(e) {
    if(e.target === overlay) overlay.remove();
  });
}

// Panggil saat app dibuka (taruh di dalam window.onload atau setelah init)
// checkAdminNotifikasi();
