import { initializeUsers, initializePosts, createPost, getUser, readUsersJSON } from "./library.js";

if (!localStorage.getItem('users')) {
    await initializeUsers();
}

if (!localStorage.getItem('posts')) {
    await initializePosts();
}

const params = new URL(window.location.href).searchParams;
const form = document.getElementById("new-post-form");
const postContentInput = document.getElementById("post-content");
const message = document.getElementById("new-post-message");

function getCurrentUserID() {
    const paramUserID = params.get("userid");

    if (paramUserID && getUser(paramUserID)) {
        localStorage.setItem("currentUserID", paramUserID);
        return paramUserID;
    }

    const storedUserID = localStorage.getItem("currentUserID");
    if (storedUserID && getUser(storedUserID)) {
        return storedUserID;
    }

    const users = readUsersJSON();
    if (users.length === 0) {
        return null;
    }

    localStorage.setItem("currentUserID", users[0].userID);
    return users[0].userID;
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const userID = getCurrentUserID();
    const content = postContentInput.value;
    const trimmedContent = content.trim();

    if (!userID) {
        message.textContent = "No user found. Please initialize users first.";
        return;
    }

    if (!trimmedContent) {
        message.textContent = "Post cannot be empty.";
        return;
    }

    const createdPostID = createPost(userID, trimmedContent);

    if (!createdPostID) {
        message.textContent = "Post cannot be empty.";
        return;
    }

    window.location.href = "feed.html?userid=" + encodeURIComponent(userID);
});
