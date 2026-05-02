import {
    initializeUsers,
    initializePosts,
    newUser,
    getUser,
    doesUserExist,
    isValidEmail
} from "./library.js"

await initializeUsers();
await initializePosts();

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const registerBtn = document.getElementById("registerBtn");
const error = document.getElementById("error");

registerBtn.addEventListener('click', async () => {

    if (!(password.value.length >= 6)) {
        showError("Invalid password length!");
        return;
    }

    if (!isValidEmail(email.value)) {
        showError("Invalid email!");
        return;
    }

    const newUserID = await newUser(username.value, email.value, password.value);

    if (!newUserID) {
        showError("Email already exists!");
        return;
    }

    localStorage.setItem('currentUserID', newUserID);
    window.location.replace("./users.html");

});

function showError(message) {

    error.textContent = message;
    error.style.display = "block";

}