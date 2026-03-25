import {
    initializeUsers,
    initializePosts,
    getUser,
    changeBio,
    changeUsername,
    logout
} from "./library.js";

if (!localStorage.getItem('users')) {
    await initializeUsers();
}

if (!localStorage.getItem('posts')) {
    await initializePosts();
}

const params = new URL(window.location.href).searchParams;
const userIDParam = params.get('userid');

const username = document.getElementById('username');
const userid = document.getElementById('userid');
const email = document.getElementById('email');
const bio = document.getElementById('bio');
const followersCount = document.getElementById('followersCount');
const followingCount = document.getElementById('followingCount');
const postsCount = document.getElementById('postsCount');
const pfpText = document.getElementById('pfpText');
const editProfileBtn = document.getElementById('editProfileBtn');
const editModal = document.getElementById('editModal');
const editProfileForm = document.getElementById('editProfileForm');
const editUsernameInput = document.getElementById('editUsername');
const editBioInput = document.getElementById('editBio');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener('click', () => logout());

editModal.hidden = true;

function getCurrentUserID() {
    if (userIDParam && getUser(userIDParam)) {
        localStorage.setItem('currentUserID', userIDParam);
        return userIDParam;
    }

    const storedUserID = localStorage.getItem('currentUserID');
    if (storedUserID && getUser(storedUserID)) {
        return storedUserID;
    }

    return;

}

function loadUserData() {
    const profileUserID = getCurrentUserID();

    if (!profileUserID) {
        alert('No user found Please log in first.');
        window.location.href = 'login.html';
        return;
    }

    const user = getUser(profileUserID);

    if (!user) {
        alert('Invalid user.');
        window.location.href = 'feed.html';
        return;
    }

    username.textContent = user.username;
    userid.textContent = '@' + user.username;
    email.textContent = user.email;
    bio.textContent = user.bio || 'No bio';
    followersCount.textContent = user.followersCount;
    followingCount.textContent = user.followingCount;
    postsCount.textContent = user.postsCount;
    pfpText.textContent = user.username[0];

    const currentUserID = getCurrentUserID();
    if (profileUserID === currentUserID) {
        editProfileBtn.style.display = '';
    } else {
        editProfileBtn.style.display = 'none';
    }

    return profileUserID;
}

let currentProfileUserID = null;

function openEditModal() {
    const user = getUser(currentProfileUserID);

    editUsernameInput.value = user.username;
    editBioInput.value = user.bio || '';
    editModal.hidden = false;
}

function closeEditModal() {
    editModal.hidden = true;
}

editProfileForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const newUsername = editUsernameInput.value.trim();
    if (!newUsername) {
        alert('Username cannot be empty.');
        return;
    }

    changeUsername(currentProfileUserID, newUsername);
    changeBio(currentProfileUserID, editBioInput.value.trim());

    closeEditModal();
    loadUserData();
});

cancelEditBtn.addEventListener('click', closeEditModal);
editProfileBtn.addEventListener('click', openEditModal);

currentProfileUserID = loadUserData();