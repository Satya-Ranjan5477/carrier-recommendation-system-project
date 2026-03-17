// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Generate Special ID
        let userCount = localStorage.getItem("userCount");
        if (!userCount) {
            userCount = 1;
        } else {
            userCount = parseInt(userCount) + 1;
        }

        localStorage.setItem("userCount", userCount);

        const specialId = "CM2026" + String(userCount).padStart(3, '0');

        const user = {
            id: specialId,
            name: name,
            phone: phone,
            email: email,
            password: password
        };

        localStorage.setItem("user", JSON.stringify(user));

        alert("Registration Successful! Your ID is: " + specialId);

        window.location.href = "login.html";
    });
}



// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser && email === storedUser.email && password === storedUser.password) {

            localStorage.setItem("loggedInUser", JSON.stringify(storedUser));

            alert("Login Successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid Email or Password");
        }
    });
}

// DASHBOARD DISPLAY
const userData = JSON.parse(localStorage.getItem("loggedInUser"));

if (userData) {

    const name = document.getElementById("userName");
    const email = document.getElementById("userEmail");
    const phone = document.getElementById("userPhone");
    const id = document.getElementById("userId");

    if (name) {
        name.textContent = "Name: " + userData.name;
        id.textContent = "Special ID: " + userData.id;
        email.textContent = "Email: " + userData.email;
        phone.textContent = "Phone: " + userData.phone;
    }
}



// PROFILE PHOTO UPLOAD
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

// Load saved profile image
const savedImage = localStorage.getItem("profileImage");
if (savedImage && document.getElementById("profileImage")) {
    document.getElementById("profileImage").src = savedImage;
}


// LOGOUT
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}
