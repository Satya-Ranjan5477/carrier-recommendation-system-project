import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = window.firebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const isDashboardPage = document.body.classList.contains("dashboard-body");

function parseUserIdentity(user) {
    const displayName = user && user.displayName ? user.displayName : "";
    const [storedUserId, ...nameParts] = displayName.split("|");

    if (/^[A-Z]{3}\d{3}$/.test(storedUserId)) {
        return {
            userId: storedUserId,
            userName: nameParts.join("|") || "User"
        };
    }

    return {
        userId: localStorage.getItem("userId") || user.uid,
        userName: displayName || "User"
    };
}

function getProfileImageKey(userId) {
    return `profileImage_${userId}`;
}

window.addEventListener("load", () => {
    const features = document.querySelector(".features");

    if (features) {
        features.scrollLeft = 0;
    }
});

window.openCareerPath = function () {
    window.location.href = "/career-path";
};

window.openCareerTest = function () {
    window.location.href = "/form";
};

window.openDashboard = function () {
    window.location.href = "/dashboard";
};

window.openResultPage = function () {
    window.location.href = "/result";
};

if (isDashboardPage) {
    onAuthStateChanged(auth, (user) => {
        const latestCareer = document.getElementById("latestCareer");
        const latestScore = document.getElementById("latestScore");
        const historyDiv = document.getElementById("history");
        const totalAttemptsEl = document.getElementById("totalAttempts");
        const avgScoreEl = document.getElementById("avgScore");
        const bestScoreEl = document.getElementById("bestScore");

        if (historyDiv) historyDiv.innerHTML = "";
        if (latestCareer) latestCareer.innerText = "Loading...";
        if (latestScore) latestScore.innerText = "";

        if (user) {
            const identity = parseUserIdentity(user);
            const userId = identity.userId;
            localStorage.setItem("userId", userId);

            const userName = document.getElementById("userName");
            const userIdText = document.getElementById("userId");

            if (userName) userName.innerText = identity.userName;
            if (userIdText) userIdText.innerText = "User ID : " + userId;

            loadDashboard(userId);
            return;
        }

        localStorage.removeItem("userId");

        if (latestCareer) latestCareer.innerText = "No user logged in";
        if (latestScore) latestScore.innerText = "";
        if (totalAttemptsEl) totalAttemptsEl.innerText = 0;
        if (avgScoreEl) avgScoreEl.innerText = 0;
        if (bestScoreEl) bestScoreEl.innerText = 0;

        window.location.href = "/login";
    });

    window.logout = async function () {
        try {
            await fetch("/logout", { credentials: "include" });
        } catch (error) {
            console.warn("Logout request failed", error);
        }

        try {
            await signOut(auth);
        } catch (error) {
            console.warn("Firebase sign-out failed", error);
        }

        localStorage.removeItem("userId");
        window.location.href = "/login";
    };

    const uploadPhoto = document.getElementById("uploadPhoto");

    if (uploadPhoto) {
        uploadPhoto.addEventListener("change", function () {
            const currentUserId = localStorage.getItem("userId");
            if (!currentUserId || !this.files || !this.files[0]) {
                return;
            }

            const reader = new FileReader();
            reader.onload = function () {
                localStorage.setItem(getProfileImageKey(currentUserId), reader.result);
                const profileImage = document.getElementById("profileImage");
                if (profileImage) {
                    profileImage.src = reader.result;
                }
            };

            reader.readAsDataURL(this.files[0]);
        });
    }

    const currentUserId = localStorage.getItem("userId");
    const savedImage = currentUserId ? localStorage.getItem(getProfileImageKey(currentUserId)) : null;
    const profileImage = document.getElementById("profileImage");
    if (savedImage && profileImage) {
        profileImage.src = savedImage;
    }
}

function loadDashboard(userId) {
    const history = JSON.parse(localStorage.getItem(`history_${userId}`)) || [];

    const latestCareer = document.getElementById("latestCareer");
    const latestScore = document.getElementById("latestScore");
    const historyDiv = document.getElementById("history");
    const totalAttemptsEl = document.getElementById("totalAttempts");
    const avgScoreEl = document.getElementById("avgScore");
    const bestScoreEl = document.getElementById("bestScore");

    if (!historyDiv) {
        return;
    }

    historyDiv.innerHTML = "";

    if (history.length === 0) {
        if (latestCareer) latestCareer.innerText = "No attempts yet";
        if (latestScore) latestScore.innerText = "Take a quiz to see results";
        if (totalAttemptsEl) totalAttemptsEl.innerText = 0;
        if (avgScoreEl) avgScoreEl.innerText = 0;
        if (bestScoreEl) bestScoreEl.innerText = 0;
        return;
    }

    const latest = history[history.length - 1];
    let totalScore = 0;
    let bestScore = 0;

    if (latestCareer) latestCareer.innerText = latest.career;
    if (latestScore) latestScore.innerText = `Score: ${latest.score}/${latest.total}`;

    [...history].reverse().forEach((item, index) => {
        totalScore += item.score;
        bestScore = Math.max(bestScore, item.score);

        historyDiv.innerHTML += `
            <p>
                <b>Attempt ${history.length - index}</b> - ${item.career} - ${item.score}/${item.total}
                ${index === 0 ? '<span class="latest-badge">(Latest)</span>' : ''}
                <br>
                <small>${item.date}</small>
            </p><hr>
        `;
    });

    const totalAttempts = history.length;
    const avgScore = (totalScore / totalAttempts).toFixed(1);

    if (totalAttemptsEl) totalAttemptsEl.innerText = totalAttempts;
    if (avgScoreEl) avgScoreEl.innerText = avgScore;
    if (bestScoreEl) bestScoreEl.innerText = bestScore;

    setTimeout(() => {
        const barCanvas = document.getElementById("barChart");
        const pieCanvas = document.getElementById("pieChart");

        if (!barCanvas || !pieCanvas || typeof Chart === "undefined") {
            return;
        }

        if (window.barChart && typeof window.barChart.destroy === "function") {
            window.barChart.destroy();
        }

        if (window.pieChart && typeof window.pieChart.destroy === "function") {
            window.pieChart.destroy();
        }

        const labels = history.map((_, index) => `Attempt ${index + 1}`);
        const scores = history.map((item) => item.score);

        window.barChart = new Chart(barCanvas.getContext("2d"), {
            type: "bar",
            data: {
                labels,
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

        let good = 0;
        let average = 0;
        let poor = 0;

        history.forEach((item) => {
            if (item.score >= 5) {
                good += 1;
            } else if (item.score >= 3) {
                average += 1;
            } else {
                poor += 1;
            }
        });

      
        const ctx = document.getElementById("pieChart").getContext("2d");

        const pieChart = new Chart(ctx, {
         type: "doughnut",
           data: {
            labels: ["Good", "Average", "Poor"],
            datasets: [{
            data: [good, average, poor],
            backgroundColor: ['#49A9EA', '#FF6384', '#FF9F40'],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        
        cutout: "70%",
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#ccc"
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let total = context.dataset.data.reduce((a, b) => a + b, 0);
                        let value = context.raw;
                        let percent = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value} attempts (${percent}%)`;
                    }
                }
            }
        }
    },
    plugins: [{
        id: "centerText",
        beforeDraw(chart) {
            const { width, height, ctx } = chart;

            let total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);

            ctx.restore();
            ctx.font = "bold 16px sans-serif";
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";

            ctx.fillText(total + " Attempts", width / 2, height / 2);
            ctx.save();
        }
    }]
});

let insight = "";

if (good >= average && good >= poor) {
    insight = "You are consistently performing well 🎯";
} else if (average >= good && average >= poor) {
    insight = "Your performance is moderate, improvement needed 📈";
} else {
    insight = "Your performance needs improvement ⚠️";
}

document.getElementById("insightText").innerText = insight;
    }, 150);
}
