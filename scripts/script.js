import { nanoid } from "nanoid";

export { newUser }

function newUser(username, email, password) {

    const users = readUsersJSON();
    const newUserID = nanoid(10);

    users.push({
        "userid": newUserID,
        "username": username,
        "email": email,
        "passwordSHA256": sha256(password),
        "bio": "",
        "followersCount": 0,
        "followingCount": 0,
        "followers": [],
        "following": [],
        "postsCount": 0,
        "posts": []
    });

    writeUsersJSON(users);

    return newUserID;

}

function createPost(userID, postContent) {
    // create post and return post id
}

function deletePost(postID) {
    // delete post and update users.json accordingly
}

function likePost(userID, postID) {
    // increment like counter
    // edit users.json or posts.json to track which users liked which posts
}

function removeLike(userID, postID) {
    // decrement like counter and update posts.json accordingly
}

// comment on post
// delete comment
// follow
// unfollow
// change bio
// add profile picture
// change username

// add timestamp to both json files



function readUsersJSON() {
    const fs = require('fs');
    const path = '../content/users.json';
    const content = fs.readFileSync(path, 'utf-8');

    const contentObject = JSON.parse(content);

    return contentObject;
}

function writeUsersJSON(users) {
    const newContent = JSON.stringify(users, null, 4);

    const fs = require('fs');
    const path = '../content/users.json';

    fs.writeFileSync(path, newContent, 'utf-8');
}

function sha256(input) {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(input);
    return hash.digest('hex');
}