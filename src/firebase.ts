import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Using initializeFirestore with experimentalForceLongPolling and useFetchStreams: false to handle potential network/proxy/sandbox issues
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
} as any, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

// Initialize Google Provider
import { GoogleAuthProvider } from 'firebase/auth';
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Forces account selection
});

// Set persistence to LOCAL (survives browser restarts)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ Auth persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("❌ Persistence error:", error);
  });

// Validate Connection to Firestore
async function testConnection() {
  try {
    // We attempt to read a document from a likely-public collection (news)
    // to verify the configuration and connectivity.
    await getDocFromServer(doc(db, 'news', 'connection-test'));
    console.log("Firestore connection verified.");
  } catch (error: any) {
    // If we get a 'permission-denied' error, it means we successfully reached the server
    // and the configuration is correct, but the security rules blocked the read.
    // This is considered a "success" for a connectivity test.
    if (error.code === 'permission-denied') {
      console.log("Firestore connectivity verified (Server reached).");
      return;
    }

    console.error("Firestore connection test failed:", error.message);
    if (error.message.includes('the client is offline') || error.code === 'unavailable') {
      console.error("Please check your Firebase configuration and internet connection.");
    }
  }
}
testConnection();

export default app;
