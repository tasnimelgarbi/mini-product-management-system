// Simple Express backend that uses Firebase Admin SDK to interact with Firestore.
// Place your serviceAccountKey.json (from Firebase Console -> Project Settings -> Service accounts) in the server/ folder.
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const fs = require('fs');

if (!fs.existsSync('./serviceAccountKey.json')) {
  console.error('Missing serviceAccountKey.json in server/ folder. Copy it from Firebase Console -> Service accounts.');
  process.exit(1);
}

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// CRUD endpoints
app.get('/products', async (req, res) => {
  const snapshot = await db.collection('products').get();
  const products = [];
  snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
  res.json(products);
});

app.post('/products', async (req, res) => {
  const data = req.body;
  const ref = await db.collection('products').add(data);
  const doc = await ref.get();
  res.json({ id: ref.id, ...doc.data() });
});

app.put('/products/:id', async (req, res) => {
  const id = req.params.id;
  await db.collection('products').doc(id).set(req.body, { merge: true });
  const doc = await db.collection('products').doc(id).get();
  res.json({ id: doc.id, ...doc.data() });
});

app.delete('/products/:id', async (req, res) => {
  const id = req.params.id;
  await db.collection('products').doc(id).delete();
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server listening on port', PORT));
