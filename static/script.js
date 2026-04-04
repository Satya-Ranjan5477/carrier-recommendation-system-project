import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBJH6QrR5sEHRzdTeCV-N3dl99rDs_1xzk",
    authDomain: "career-mitracom.firebaseapp.com",
    projectId: "career-mitracom",
    storageBucket: "career-mitracom.firebasestorage.app",
    messagingSenderId: "298890333500",
    appId: "1:298890333500:web:f8acde75ceb927d7246239"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// generate id
function generateUserId(name) {
    const letters = name.substring(0,2).toUpperCase();
    const numbers = Math.floor(10000 + Math.random() * 90000);
    return letters + numbers;
}

// show dashboard user
onAuthStateChanged(auth, (user) => {
    if (user) {

        let name = user.displayName || "User";

        let storedId = localStorage.getItem("userId");

        if (!storedId) {
            storedId = generateUserId(name);
            localStorage.setItem("userId", storedId);
        }

        const userName = document.getElementById("userName");
const userId = document.getElementById("userId");

if(userName){
    userName.innerText = name;
    userId.innerText = "User ID : " + storedId;
}
    }
});


// profile photo
const uploadPhoto = document.getElementById("uploadPhoto");

if (uploadPhoto) {
    uploadPhoto.addEventListener("change", function() {
        const reader = new FileReader();
        reader.onload = function() {
            localStorage.setItem("profileImage", reader.result);
            document.getElementById("profileImage").src = reader.result;
        };
        reader.readAsDataURL(this.files[0]);
    });
}

const savedImage = localStorage.getItem("profileImage");
if (savedImage && document.getElementById("profileImage")) {
    document.getElementById("profileImage").src = savedImage;
}

// logout
window.logout = function() {
    signOut(auth).then(() => {
        window.location.href = "/login";
    });
};
