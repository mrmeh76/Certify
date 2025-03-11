import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import {initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY ?? process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.AUTH_DOMAIN ?? process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID ?? process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.STORAGE_KEY ?? process.env.NEXT_PUBLIC_STORAGE_KEY,
  messagingSenderId: process.env.MESSAGING_SENDER_ID ?? process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.APP_ID ?? process.env.NEXT_PUBLIC_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const appCheck = initializeAppCheck(app, {
//     provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_RECAPTCHA ?? ""),
//     isTokenAutoRefreshEnabled: true
// });
export const db = getFirestore(app);
