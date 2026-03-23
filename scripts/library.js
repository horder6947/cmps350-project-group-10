// Shared Data Functions for the Web Frontend

import { nanoid } from "./nanoid.js";

export {
    newUser,
    getUser,
    doesUserExist,
    login,
    createPost,
    deletePost,
    likePost,
    removeLike,
    commentOnPost,
    deleteComment,
    follow,
    unfollow,
    changeBio,
    addProfilePicture,
    changeUsername,
    changePassword,
    getPostsByAuthorID,
    getFollowers,
    getFollowing,
    getPostsSortByLikes,
    getPostsSortByComments,
    getPostsSortChronologically,
    readUsersJSON,
    readPostsJSON,
    sha256
}

async function test() {
    console.log(await sha256("password123"));
}

async function newUser(username, email, password) {

    const users = readUsersJSON();
    const newUserID = nanoid(10);

    users.push({
        "userID": newUserID,
        "username": username,
        "email": email,
        "passwordSHA256": await sha256(password),
        "bio": "",
        "createdTimestamp": Date.now(),
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

function getUser(userID) {

    const users = readUsersJSON();

    return users.find((e) => e.userID === userID);

}

function doesUserExist(email) {

    const users = readUsersJSON();
    if (users.find((e) => e.email === email))
        return true;
    return false;

}

async function login(email, password) {

    const users = readUsersJSON();
    const user = users.find((e) => e.email === email);

    if (!user) return false;

    return await sha256(password) === user.passwordSHA256;

}

function createPost(userID, postContent) {

    const posts = readPostsJSON();
    const newPostID = nanoid(20);

    posts.push({
        "postID": newPostID,
        "authorID": userID,
        "postContent": postContent,
        "createdTimestamp": Date.now(),
        "likesCount": 0,
        "likes": [],
        "commentsCount": 0,
        "comments": []
    });

    writePostsJSON(posts);

    const users = readUsersJSON();

    const author = users.find((e) => e.userID === userID);
    author.postsCount += 1;
    author.posts.push(newPostID);

    writeUsersJSON(users);

    return newPostID;
}

function deletePost(postID) {

    const posts = readPostsJSON();
    const postIndex = posts.findIndex((e) => e.postID === postID);

    if (postIndex === -1) return; // If the post is not found

    const authorID = posts[postIndex].authorID;
    // const author = posts[postIndex].authorID;
    posts.splice(postIndex, 1);

    writePostsJSON(posts);

    const users = readUsersJSON();
    const author = users.find((e) => e.userID === authorID);

    const index = author.posts.indexOf(postID);
    if (index === -1) return;
    author.posts.splice(index, 1);
    author.postsCount -= 1;

    writeUsersJSON(users);

}

function likePost(userID, postID) {

    const posts = readPostsJSON();
    const post = posts.find((e) => e.postID === postID);

    post.likesCount += 1;
    post.likes.push(userID);

    writePostsJSON(posts);

}

function removeLike(userID, postID) {

    const posts = readPostsJSON();
    const postIndex = posts.findIndex((e) => e.postID === postID);

    if (postIndex === -1) return;

    const post = posts[postIndex];
    post.likesCount -= 1;
    post.likes.splice(post.likes.indexOf(userID), 1);

    writePostsJSON(posts);

}

function commentOnPost(userID, postID, comment) {

    const posts = readPostsJSON();
    const commentID = nanoid(20);
    const newComment = {
        "commentID": commentID,
        "authorID": userID,
        "createdTimestamp": Date.now(),
        "comment": comment
    };

    const post = posts.find((e) => e.postID === postID);
    post.comments.push(newComment);

    writePostsJSON(posts);

    return commentID;

}

function deleteComment(postID, commentID) {

    const posts = readPostsJSON();
    const post = posts.find((e) => e.postID === postID);

    console.log(posts);

    const commentIndex = post.comments.findIndex((e) => e.commentID === commentID);
    if (commentIndex === -1) return;

    post.comments.splice(commentIndex, 1);
    post.commentsCount -= 1;

    writePostsJSON(posts);

}

function follow(followerID, followeeID) {

    const users = readUsersJSON();
    const follower = users.find((e) => e.userID === followerID);
    const followee = users.find((e) => e.userID === followeeID);

    follower.following.push(followeeID);
    follower.followingCount += 1;
    followee.followers.push(followerID);
    followee.followersCount += 1;

    writeUsersJSON(users);

}

function unfollow(followerID, followeeID) {

    const users = readUsersJSON();
    const follower = users.find((e) => e.userID === followerID);
    const followee = users.find((e) => e.userID === followeeID);

    let index = 0;

    index = follower.following.indexOf(followeeID);
    if (index === -1) return;
    follower.following.splice(index, 1);
    follower.followingCount -= 1;

    index = followee.followers.indexOf(followerID);
    if (index === -1) return;
    followee.followers.splice(index, 1);
    followee.followersCount -= 1;

    writeUsersJSON(users);

}

function changeBio(userID, bio) {

    const users = readUsersJSON();
    users.find((e) => e.userID === userID).bio = bio;

    writeUsersJSON(users);

}

function addProfilePicture() {
    // ???
}

function changeUsername(userID, username) {

    const users = readUsersJSON();
    users.find((e) => e.userID === userID).username = username;

    writeUsersJSON(users);

}

async function changePassword(userID, oldPassword, newPassword) {

    const users = readUsersJSON();
    const user = users.find((e) => e.userID === userID);

    if (user.password === await sha256(oldPassword)) {
        user.password = await sha256(newPassword);
        writeUsersJSON(users);
        return true;
    } else {
        return false;
    }

}

function getPostsByAuthorID(authorID) {

    const users = readUsersJSON();
    const posts = readPostsJSON();
    const authorPostsIDs = users.find((e) => e.userID === authorID).posts;

    return posts.filter((e) => authorPostsIDs.includes(e.postID));

}

function getFollowers(userID) {

    const users = readUsersJSON();
    const followersIDs = users.find((e) => e.userID === userID).followers;

    return users.filter((e) => followersIDs.includes(e.userID));

}

function getFollowing(userID) {

    const users = readUsersJSON();
    const followingIDs = users.find((e) => e.userID === userID).following;

    return users.filter((e) => followingIDs.includes(e.userID));

}

function getPostsSortByLikes(descending = true) {

    const posts = readPostsJSON();
    return posts.sort((a, b) => descending ? b.likesCount - a.likesCount : a.likesCount - b.likesCount);

}

function getPostsSortByComments(descending = true) {

    const posts = readPostsJSON();
    return posts.sort((a, b) => descending ? b.commentsCount - a.commentsCount : a.commentsCount - b.commentsCount);

}

function getPostsSortChronologically(descending = true) {

    const posts = readPostsJSON();
    return posts.sort((a, b) => descending ? b.createdTimestamp - a.createdTimestamp : a.createdTimestamp - b.createdTimestamp);

}



// function readUsersJSON() {
//     const fs = require('fs');
//     const path = '../content/users.json';
//     const content = fs.readFileSync(path, 'utf-8');

//     const contentObject = JSON.parse(content);

//     return contentObject;
// }

// function writeUsersJSON(users) {
//     const newContent = JSON.stringify(users, null, 4);

//     const fs = require('fs');
//     const path = '../content/users.json';

//     fs.writeFileSync(path, newContent, 'utf-8');
// }

function readUsersJSON() {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
}

function writeUsersJSON(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function readPostsJSON() {
    const data = localStorage.getItem('posts');
    return data ? JSON.parse(data) : [];
}

function writePostsJSON(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// function sha256(input) {
//     const crypto = require('crypto');
//     const hash = crypto.createHash('sha256');
//     hash.update(input);
//     return hash.digest('hex');
// }

// Must be called from an async function like this: 'await sha256("example")'
async function sha256(input) {
    // Convert string to Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    // Hash the data
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return hashHex;
}