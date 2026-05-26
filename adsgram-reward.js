// api/adsgram-reward.js
// Vercel Serverless Function — Adsgram Reward URL
// URL: https://domain-vercel-kamu.vercel.app/api/adsgram-reward

const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Inisialisasi Firebase Admin (hanya sekali)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

const ADSGRAM_REWARD = 15; // harus sama dengan konstanta di index.html
const ADSGRAM_LIMIT  = 5;  // max per hari

export default async function handler(req, res) {
  // Adsgram mengirim GET request ke Reward URL
  // Query params yang dikirim Adsgram: user_id (opsional, sesuai setup)
  // Kita ambil userId dari query param yang kita pasang sendiri di blockId init

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ ok: false, error: 'Missing user_id' });
  }

  try {
    const userRef = db.collection('users').doc(String(user_id));
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    const userData = userSnap.data();
    const today = new Date().toDateString();
    const adData = userData.adsgramWatch || { date: '', count: 0 };
    const count = (adData.date === today) ? adData.count : 0;

    if (count >= ADSGRAM_LIMIT) {
      return res.status(200).json({ ok: false, error: 'Daily limit reached' });
    }

    const newPoin  = (userData.poin || 0) + ADSGRAM_REWARD;
    const newCount = count + 1;

    await userRef.update({
      poin: newPoin,
      adsgramWatch: { date: today, count: newCount },
    });

    return res.status(200).json({ ok: true, poin: newPoin });

  } catch (e) {
    console.error('Reward error:', e);
    return res.status(500).json({ ok: false, error: e.message });
  }
}
