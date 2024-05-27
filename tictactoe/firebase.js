import { initializeApp } from 'firebase/app';


// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyAYepCo31QscKt3b05ChdvvPe6ZhU6HHZ8",
    authDomain: "tik-tac-toe-763e8.firebaseapp.com",
    databaseURL: "https://tik-tac-toe-763e8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tik-tac-toe-763e8",
    storageBucket: "tik-tac-toe-763e8.appspot.com",
    messagingSenderId: "564715586315", 
    appId: "1:564715586315:web:c77d45fdc77826c537d80e",
    measurementId: "G-XENGBFXZME"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
