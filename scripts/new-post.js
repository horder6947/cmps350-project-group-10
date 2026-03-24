import { initializeUsers, initializePosts, createPost, getUser } from "./library.js";

if (!localStorage.getItem("users")) {
    await initializeUsers();
}

if (!localStorage.getItem("posts")) {
    await initializePosts();
}

const elements = {
    form: document.getElementById("new-post-form"),
    contentInput: document.getElementById("post-content"),
    submitButton: document.getElementById("publish-btn"),
    statusText: document.getElementById("new-post-message")
};

bootComposerPage();

function bootComposerPage() {
    const activeUserID = resolveActiveUserID();

    if (!activeUserID) {
        setComposerDisabled(true);
        setStatus("No logged-in user found. Please log in first.");
    }

    elements.form.addEventListener("submit", handlePostSubmit);
    elements.contentInput.addEventListener("input", clearStatusOnTyping);
}

function resolveActiveUserID() {
    const savedUserID = localStorage.getItem("currentUserID");

    if (!savedUserID) {
        return null;
    }

    if (!getUser(savedUserID)) {
        return null;
    }

    return savedUserID;
}

function setComposerDisabled(disabled) {
    elements.contentInput.disabled = disabled;
    elements.submitButton.disabled = disabled;
}

function setStatus(text) {
    elements.statusText.textContent = text;
}

function clearStatusOnTyping() {
    if (elements.statusText.textContent) {
        elements.statusText.textContent = "";
    }
}

function handlePostSubmit(event) {
    event.preventDefault();

    const activeUserID = resolveActiveUserID();
    const postContent = elements.contentInput.value.trim();

    if (!activeUserID) {
        setStatus("No logged-in user found. Please log in first.");
        return;
    }

    if (!postContent) {
        setStatus("Post cannot be empty.");
        return;
    }

    const newPostID = createPost(activeUserID, postContent);
    if (!newPostID) {
        setStatus("Unable to publish post. Try again.");
        return;
    }

    window.location.href = "feed.html";
}
