
Project: Products CRUD (frontend unchanged) + Backend (Node/Express with Firestore Admin)

Structure:
- products_project_with_backend/
  - index.html          (your original HTML - unchanged)
  - style.css           (your original CSS - unchanged)
  - javascrit.js        (your original JS - unchanged)
  - firebase.js         (exports your firebaseConfig variable - DO NOT MODIFY)
  - server/
      - index.js        (Express backend using Firebase Admin SDK)
      - package.json
      - (you must place serviceAccountKey.json here)

Important notes:
1. I kept your frontend files exactly as you provided; variable names and file names were not changed.
2. To run the backend, you MUST download a Firebase service account key:
   - Go to Firebase Console -> Project Settings -> Service Accounts -> Generate new private key
   - Save the downloaded JSON file as server/serviceAccountKey.json
3. Install server dependencies and run:
   cd server
   npm install
   node index.js
   The server will run on port 5000 by default.
4. The backend endpoints:
   GET  /products
   POST /products    (body = product object)
   PUT  /products/:id
   DELETE /products/:id
5. If you want the frontend to use the backend endpoints, you will need to edit javascrit.js to replace localStorage calls with fetch() to the backend API. I did NOT modify your frontend file as you requested.
6. If you prefer, I can also prepare an integrated frontend version that calls the backend (I will NOT change your original files; I'll provide a copy integrated separately).

If you want the integrated copy or step-by-step help to run the backend and connect the frontend, tell me and I'll do it.
