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



window.addEventListener("load", () => {
    const slider = document.querySelector(".features");
    slider.scrollLeft = 0;
});

window.openCareerPath = function () {
    window.location.href = "/career-path";
};

// show dashboard user
  onAuthStateChanged(auth, (user) => {

    const latestCareer = document.getElementById("latestCareer");
    const latestScore = document.getElementById("latestScore");
    const historyDiv = document.getElementById("history");
    const totalAttemptsEl = document.getElementById("totalAttempts");
    const avgScoreEl = document.getElementById("avgScore");
    const bestScoreEl = document.getElementById("bestScore");

    // 🔥 CLEAR UI FIRST (IMPORTANT)
    if (historyDiv) historyDiv.innerHTML = "";
    if (latestCareer) latestCareer.innerText = "Loading...";
    if (latestScore) latestScore.innerText = "";

    if (user) {

        const userId = user.uid;

        // ✅ ALWAYS update correct userId
        localStorage.setItem("userId", userId);

        console.log("Logged User ID:", userId);

        const userName = document.getElementById("userName");
        const userIdText = document.getElementById("userId");

        if (userName) userName.innerText = user.displayName || "User";
        if (userIdText) userIdText.innerText = "User ID : " + userId;
        loadDashboard(userId);

    } else {
        // ❌ No user → clear everything
        localStorage.removeItem("userId");

        latestCareer.innerText = "No user logged in";
        latestScore.innerText = "";

        totalAttemptsEl.innerText = 0;
        avgScoreEl.innerText = 0;
        bestScoreEl.innerText = 0;
         window.location.href = "/login";
    }
});


// ✅ DASHBOARD FUNCTION
function loadDashboard(userId) {

    const history = JSON.parse(localStorage.getItem(`history_${userId}`)) || [];

    const latestCareer = document.getElementById("latestCareer");
    const latestScore = document.getElementById("latestScore");
    const historyDiv = document.getElementById("history");
    const totalAttemptsEl = document.getElementById("totalAttempts");
    const avgScoreEl = document.getElementById("avgScore");
    const bestScoreEl = document.getElementById("bestScore");

    historyDiv.innerHTML = "";

    if (history.length > 0) {

        let totalScore = 0;
        let bestScore = 0;

        const last = history[history.length - 1];
        latestCareer.innerText = last.career;
        latestScore.innerText = `Score: ${last.score}/${last.total}`;

        history.forEach((item, i) => {

            totalScore += item.score;

            if (item.score > bestScore) {
                bestScore = item.score;
            }
          
            let html = ""; 
            [...history].reverse().forEach((item, i) => {
            /*historyDiv.innerHTML += `*/
            html += `
        <p>
            <b>${item.career}</b> - ${item.score}/${item.total}
            ${i === 0 ? '<span style="color:green;"> (Latest)</span>' : ''}
            <br>
            <small>${item.date}</small>
        </p><hr>
    `;
});
       historyDiv.innerHTML = html;
        });

        const totalAttempts = history.length;
        const avgScore = (totalScore / totalAttempts).toFixed(1);

        totalAttemptsEl.innerText = totalAttempts;
        avgScoreEl.innerText = avgScore;
        bestScoreEl.innerText = bestScore;

        // 🔥 Charts (Destroy old charts if exist)
     // ✅ SAFE CHART RENDER
setTimeout(() => {

    const barCanvas = document.getElementById("barChart");
    const pieCanvas = document.getElementById("pieChart");

    if (!barCanvas || !pieCanvas) {
        console.error("Canvas missing!");
        return;
    }

    // 🔥 Destroy safely
    if (window.barChart && typeof window.barChart.destroy === "function") {
        window.barChart.destroy();
    }

    if (window.pieChart && typeof window.pieChart.destroy === "function") {
        window.pieChart.destroy();
    }

    const labels = history.map((h, i) => `Attempt ${i + 1}`);
    const scores = history.map(h => h.score);

    // ✅ BAR CHART
    window.barChart = new Chart(barCanvas.getContext("2d"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Quiz Score",
                data: scores,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // ✅ PIE CHART
    let good = 0, average = 0, poor = 0;

    history.forEach(h => {
        if (h.score >= 5) good++;
        else if (h.score >= 3) average++;
        else poor++;
    });

    window.pieChart = new Chart(pieCanvas.getContext("2d"), {
        type: "doughnut",
        data: {
            labels: ["Good", "Average", "Poor"],
            datasets: [{
                data: [good, average, poor]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

}, 300); // 🔥 IMPORTANT DELAY

    } else {
        // ✅ NEW USER SAFE STATE
        latestCareer.innerText = "No attempts yet";
        latestScore.innerText = "Take a quiz to see results";

        totalAttemptsEl.innerText = 0;
        avgScoreEl.innerText = 0;
        bestScoreEl.innerText = 0;
    }
}

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
     fetch("/logout") // 🔥 clear flask session
    .then(() => {
    signOut(auth).then(() => {
        window.location.href = "/login";
    });
});
};
