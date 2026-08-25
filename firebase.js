// ===== FIREBASE INTEGRATION =====

const firebaseConfig = {
  apiKey: "AIzaSyBHofZonc6VydsPYcsd7fAIHSDlUttFosw",
  authDomain: "tenx-marketplace.firebaseapp.com",
  projectId: "tenx-marketplace",
  storageBucket: "tenx-marketplace.firebasestorage.app",
  messagingSenderId: "648418902105",
  appId: "1:648418902105:web:cbaf1bca5ee710ec1d3148"
};

firebase.initializeApp(firebaseConfig);

// EmailJS init
emailjs.init('yf9JP0sM2BvKr3TU1');
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// Listen for auth state changes
auth.onAuthStateChanged(user => {
  currentUser = user;
  updateNavForAuth(user);
  // Refresh account view if it's open
  const accountView = document.getElementById('view-account');
  if (accountView && accountView.classList.contains('active')) {
    renderAccountView(user);
  }
});

// Update navbar Account button label
function updateNavForAuth(user) {
  const label = document.querySelector('#navAccountBtn .nav-label');
  if (!label) return;
  if (user) {
    const name = user.displayName || user.email.split('@')[0];
    label.textContent = name.split(' ')[0]; // first name only
  } else {
    label.textContent = 'Account';
  }
}

// Send welcome email via EmailJS
async function sendWelcomeEmail(name, email) {
  await emailjs.send('service_zz8sayo', 'template_rm342nn', {
    to_name: name,
    to_email: email,
    quote: 'AI will not Replace You, A Person using AI Will'
  });
}

// Sign up: create auth user + save profile to Firestore + send welcome email
async function signUpUser(name, email, password) {
  const cred = await auth.createUserWithEmailAndPassword(email, password);
  await cred.user.updateProfile({ displayName: name });
  await db.collection('users').doc(cred.user.uid).set({
    name,
    email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  sendWelcomeEmail(name, email); // fire and forget — don't block signup
  return cred.user;
}

// Sign in existing user
async function signInUser(email, password) {
  const cred = await auth.signInWithEmailAndPassword(email, password);
  return cred.user;
}

// Sign out
async function signOutUser() {
  await auth.signOut();
}

// Save checkout lead (fires on every "Proceed to Checkout" click)
async function saveCheckoutLead(leadData) {
  try {
    await db.collection('checkoutLeads').add({
      courses: leadData.courses,
      subtotal: leadData.subtotal,
      cartCount: leadData.cartCount,
      userId: currentUser ? currentUser.uid : null,
      userEmail: currentUser ? currentUser.email : null,
      userName: currentUser ? currentUser.displayName : null,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) {
    console.error('Checkout lead save failed:', e);
  }
}

// Save an order to Firestore under users/{uid}/orders
async function saveOrderToFirestore(orderData) {
  if (!currentUser) return;
  await db
    .collection('users')
    .doc(currentUser.uid)
    .collection('orders')
    .doc(orderData.orderId)
    .set({
      ...orderData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}

// Fetch user's orders from Firestore
async function getUserOrders() {
  if (!currentUser) return [];
  const snap = await db
    .collection('users')
    .doc(currentUser.uid)
    .collection('orders')
    .orderBy('createdAt', 'desc')
    .get();
  return snap.docs.map(d => d.data());
}
