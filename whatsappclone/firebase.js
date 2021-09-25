import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';



const firebaseConfig = {
    apiKey: "AIzaSyAzis_xqJD7T0sLDXJQnyATM-Rpk0xUrK8",
    authDomain: "whatsappclone-f00bb.firebaseapp.com",
    projectId: "whatsappclone-f00bb",
    storageBucket: "whatsappclone-f00bb.appspot.com",
    messagingSenderId: "1078992533039",
    appId: "1:1078992533039:web:530578c383478e8b3978da",
    measurementId: "G-D9GFXXJ7CD"
};

const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };