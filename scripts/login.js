import {
    initializeUsers,
    initializePosts,
    login,
    logout,
    doesUserExist,
    getUser
} from "./library.js"

await initializeUsers();
await initializePosts();

const loginBtn = document.getElementById("loginButton");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const error = document.getElementById("error");

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener('click', () => logout());

loginBtn.addEventListener('click', async () => {

    const userID = await login(emailInput.value, passwordInput.value);

    if (!userID) {
        error.textContent = "Invalid email or password!";
        error.style.display = 'block';
        return;
    }

    localStorage.setItem('currentUserID', userID);
    window.location.replace("./feed.html");

});