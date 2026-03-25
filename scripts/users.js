import {
    initializeUsers,
    initializePosts,
    getUser,
    follow,
    unfollow,
    logout
} from "./library.js";

await initializeUsers();
await initializePosts();

loadUsers();

const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener('click', () => logout());

function getCurrentUserID() {
    const storedUserID = localStorage.getItem("currentUserID");
    if (storedUserID && getUser(storedUserID)) {
        return storedUserID;
    }

    return null;
}

function getAllUsers() {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
}

function loadUsers() {
    const currentUserID = getCurrentUserID();
    let usersContainer = document.getElementById('users-container');
    let users = getAllUsers();

    if (!users || users.length === 0) {
        usersContainer.innerHTML = '<p>No users found.</p>';
        return;
    }

    users = users.filter(user => user.userID !== currentUserID);

    users.sort((a, b) => b.followersCount - a.followersCount);

    usersContainer.innerHTML = '';

    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        const isFollowing = currentUserID ? user.followers.includes(currentUserID) : false;

        let article = document.createElement('article');
        article.className = 'card user-card';

        let html = '';
        html += '<div class="user-header">';
        html += '  <div class="user-avatar">' + user.username[0] + '</div>';
        html += '  <div class="user-info">';
        html += '    <h3 class="user-username">' + user.username + '</h3>';
        html += '    <p class="user-userid">@' + user.userID + '</p>';
        html += '  </div>';
        html += '</div>';
        html += '<div class="user-bio">' + (user.bio || 'No bio') + '</div>';
        html += '<div class="user-stats">';
        html += '  <div class="user-stat">';
        html += '    <span class="user-stat-value">' + user.followersCount + '</span>';
        html += '    <span class="user-stat-label">Followers</span>';
        html += '  </div>';
        html += '  <div class="user-stat">';
        html += '    <span class="user-stat-value">' + user.followingCount + '</span>';
        html += '    <span class="user-stat-label">Following</span>';
        html += '  </div>';
        html += '  <div class="user-stat">';
        html += '    <span class="user-stat-value">' + user.postsCount + '</span>';
        html += '    <span class="user-stat-label">Posts</span>';
        html += '  </div>';
        html += '</div>';
        html += '<div class="user-actions">';
        if (isFollowing) {
            html += '  <button class="btn btn-unfollow">Unfollow</button>';
        } else {
            html += '  <button class="btn btn-follow">Follow</button>';
        }
        html += '</div>';

        article.innerHTML = html;

        let followBtn = article.querySelector('.btn-follow') || article.querySelector('.btn-unfollow');
        followBtn.onclick = function () {
            if (!currentUserID) {
                alert('Please log in first to follow users.');
                window.location.href = 'login.html';
                return;
            }

            if (isFollowing) {
                unfollow(currentUserID, user.userID);
            } else {
                follow(currentUserID, user.userID);
            }

            loadUsers();
        };

        usersContainer.appendChild(article);
    }
}
