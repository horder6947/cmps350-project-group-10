import { initializeUsers, initializePosts, getUser } from "./library.js";

// Get the full current URL
const currentUrl = new URL(window.location.href);
// Access the searchParams property, which is a URLSearchParams object
const searchParams = currentUrl.searchParams;

const userIDParam = searchParams.get('userid');
const loggedInIDParam = searchParams.get('loggedin');

// const users = readUsersJSON();

const username = document.getElementById('username');
const userid = document.getElementById('userid');
const email = document.getElementById('email');
const bio = document.getElementById('bio');
const followersCount = document.getElementById('followersCount');
const followingCount = document.getElementById('followingCount');
const postsCount = document.getElementById('postsCount');
const pfpText = document.getElementById('pfpText');

if (!localStorage.getItem('users')) {
    await initializeUsers();
}

if (!localStorage.getItem('posts')) {
    await initializePosts();
}

function loadUserData() {

    if (!userIDParam) {
        alert('Invalid URL Parameter');
        return;
    }

    const user = getUser(userIDParam);

    if (!user) {
        alert('Invalid UserID');
        return;
    }

    username.textContent = user.username;
    userid.textContent = "@" + user.userID;
    email.textContent = user.email;
    bio.textContent = user.bio;
    followersCount.textContent = user.followersCount;
    followingCount.textContent = user.followingCount;
    postsCount.textContent = user.postsCount;
    pfpText.textContent = user.username[0];

}

loadUserData();

// console.log(await sha256("password123"));