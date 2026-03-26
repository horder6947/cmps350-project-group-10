// Shared Data Functions for the Web Frontend

import { nanoid } from "./nanoid.js";

export {
    initializeUsers,
    initializePosts,
    newUser,
    getUser,
    getPost,
    doesUserExist,
    login,
    logout,
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
    sortPostsByLikes,
    sortPostsByComments,
    sortPostsChronologically,
    getFollowingPosts,
    getAllPosts,
    isValidEmail
}

async function initializeUsers() {

    const response = await fetch('./content/users.json');
    const users = await response.json();

    if (!localStorage.getItem('users')) {

        localStorage.setItem('users', JSON.stringify(users));
        console.log('Initialized users from JSON');

    }
}

async function initializePosts() {

    const response = await fetch('./content/posts.json');
    const posts = await response.json();

    if (!localStorage.getItem('posts')) {

        localStorage.setItem('posts', JSON.stringify(posts));
        console.log('Initialized posts from JSON');
    }
}

// returns userID if user created and undefined if not created
async function newUser(username, email, password) {

    if (doesUserExist(email))
        return;

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

// returns full user object if exists and false if not exists
function getUser(userID) {

    const users = readUsersJSON();

    return users.find((e) => e.userID === userID);

}

// returns full post object if exists and false if not exists
function getPost(postID) {

    const posts = readPostsJSON();

    return posts.find((e) => e.postID === postID);

}

// returns userID if exists and undefined if not exists
function doesUserExist(email) {

    const users = readUsersJSON();
    const user = users.find((e) => e.email === email);
    if (user)
        return user.userID;
    return;

}

// returns userID if user logged in successfully, undefined if not logged in
async function login(email, password) {

    const users = readUsersJSON();
    const user = users.find((e) => e.email === email);

    if (!user) return;

    if (await sha256(password) === user.passwordSHA256)
        return user.userID;

}

function logout() {

    localStorage.removeItem('currentUserID');

}

// returns postID if post created and undefined if not created
function createPost(userID, postContent) {

    const posts = readPostsJSON();
    const users = readUsersJSON();

    if (!getUser(userID))
        return;

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

    const author = users.find((e) => e.userID === userID);
    author.postsCount += 1;
    author.posts.push(newPostID);

    writeUsersJSON(users);

    return newPostID;
}

// returns true if found and deleted and false if not found
function deletePost(postID) {

    const posts = readPostsJSON();
    const postIndex = posts.findIndex((e) => e.postID === postID);

    if (postIndex === -1) return false; // If the post is not found

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

    return true;

}

// returns false if userID or postID is invalid or user already liked the post, returns true if post liked successfully
function likePost(userID, postID) {

    const posts = readPostsJSON();
    const users = readUsersJSON();
    const post = posts.find((e) => e.postID === postID);
    const user = users.find((e) => e.userID === userID);

    if (!post || !user)
        return false;

    if (post.likes.includes(user.userID))
        return false;

    post.likesCount += 1;
    post.likes.push(userID);

    writePostsJSON(posts);

    return true;

}

// returns false if userID or postID invalid or if user hasn't liked post, true otherwise
function removeLike(userID, postID) {

    const posts = readPostsJSON();
    const users = readUsersJSON();
    const postIndex = posts.findIndex((e) => e.postID === postID);
    const user = users.find((e) => e.userID === userID);

    if (!user)
        return false;

    if (postIndex === -1)
        return false;

    const post = posts[postIndex];

    if (!post.likes.includes(user.userID))
        return false;

    post.likesCount -= 1;
    post.likes.splice(post.likes.indexOf(userID), 1);

    writePostsJSON(posts);

    return true;

}

// returns commentID if comment added or false if userID or postID invalid
function commentOnPost(userID, postID, comment) {

    const posts = readPostsJSON();
    const users = readUsersJSON();

    const commentID = nanoid(20);
    const newComment = {
        "commentID": commentID,
        "authorID": userID,
        "createdTimestamp": Date.now(),
        "comment": comment
    };

    const post = posts.find((e) => e.postID === postID);
    const user = users.find((e) => e.userID === userID);

    if (!user || !post)
        return;

    post.comments.push(newComment);

    writePostsJSON(posts);

    return commentID;

}

// returns false if postID or commentID is invalid, true if comment deleted
function deleteComment(postID, commentID) {

    const posts = readPostsJSON();
    const post = posts.find((e) => e.postID === postID);

    if (!post)
        return false;

    const commentIndex = post.comments.findIndex((e) => e.commentID === commentID);
    if (commentIndex === -1) return false;

    post.comments.splice(commentIndex, 1);
    post.commentsCount -= 1;

    writePostsJSON(posts);

    return true;

}

// returns false if either IDs is invalid or if follower already follows followee, true otherwise
function follow(followerID, followeeID) {

    const users = readUsersJSON();
    const follower = users.find((e) => e.userID === followerID);
    const followee = users.find((e) => e.userID === followeeID);

    if (!follower || !followee)
        return false;

    if (follower.following.includes(followeeID) || followee.followers.includes(followerID))
        return false;

    follower.following.push(followeeID);
    follower.followingCount += 1;
    followee.followers.push(followerID);
    followee.followersCount += 1;

    writeUsersJSON(users);

    return true;

}

// returns false if either IDs is invalid or follower is not currently following followee, true if unfollowed successfully
function unfollow(followerID, followeeID) {

    const users = readUsersJSON();
    const follower = users.find((e) => e.userID === followerID);
    const followee = users.find((e) => e.userID === followeeID);

    if (!followee || !follower)
        return false;

    if (!follower.following.includes(followee.userID) || !followee.followers.includes(follower.userID))
        return false;

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

    return true;

}

// returns false if userID invalid, true if bio changed
function changeBio(userID, bio) {

    const users = readUsersJSON();
    const user = users.find((e) => e.userID === userID);

    if (!user)
        return false;

    user.bio = bio;

    writeUsersJSON(users);

    return true;

}

function addProfilePicture() {
    // ???
}

// returns false if userID invalid, true if username changed
function changeUsername(userID, username) {

    const users = readUsersJSON();
    const user = users.find((e) => e.userID === userID);

    if (!user)
        return false;

    user.username = username;

    writeUsersJSON(users);

    return true;

}

// returns true if password changed, false if old password incorrect or userID invalid
async function changePassword(userID, oldPassword, newPassword) {

    const users = readUsersJSON();
    const user = users.find((e) => e.userID === userID);

    if (!user)
        return false;

    if (user.passwordSHA256 !== await sha256(oldPassword))
        return false;

    user.passwordSHA256 = await sha256(newPassword);
    writeUsersJSON(users);
    return true;

}

// returns all post objects by a specific userID if found, and undefined if userID is invalid
function getPostsByAuthorID(authorID) {

    const users = readUsersJSON();
    const posts = readPostsJSON();

    const user = users.find((e) => e.userID === authorID);

    if (!user)
        return;

    const authorPostsIDs = user.posts;

    return posts.filter((e) => authorPostsIDs.includes(e.postID));

}

// returns all follower objects, or undefined if userID is invalid
function getFollowers(userID) {

    const users = readUsersJSON();
    const user = users.find((e) => e.userID === userID);

    if (!user)
        return;

    const followersIDs = user.followers;

    return users.filter((e) => followersIDs.includes(e.userID));

}

// returns all following objects, or undefined if userID is invalid
function getFollowing(userID) {

    const users = readUsersJSON();
    const user = users.find((e) => e.userID === userID);

    if (!user)
        return;

    const followingIDs = user.following;

    return users.filter((e) => followingIDs.includes(e.userID));


}

// receives, sorts, and returns posts objects, returns undefined if posts parameter is invalid
function sortPostsByLikes(posts, descending = true) {

    if (!posts)
        return;

    return posts.sort((a, b) => descending ? b.likesCount - a.likesCount : a.likesCount - b.likesCount);

}

// receives, sorts, and returns posts objects, returns undefined if posts parameter is invalid
function sortPostsByComments(posts, descending = true) {

    if (!posts)
        return;

    return posts.sort((a, b) => descending ? b.commentsCount - a.commentsCount : a.commentsCount - b.commentsCount);

}

// receives, sorts, and returns posts objects, returns undefined if posts parameter is invalid
function sortPostsChronologically(posts, descending = true) {

    if (!posts)
        return;

    return posts.sort((a, b) => descending ? b.createdTimestamp - a.createdTimestamp : a.createdTimestamp - b.createdTimestamp);

}

// returns all posts by user's followers, returns undefined if userID is invalid
function getFollowingPosts(userID) {

    const users = readUsersJSON();
    const posts = readPostsJSON();

    const user = users.find((e) => e.userID === userID);

    if (!user)
        return;

    const following = user.following;

    const followingPosts = posts.filter((e) => following.includes(e.authorID));

    return followingPosts;

}

// returns all posts
function getAllPosts() {

    return readPostsJSON();

}

function isValidEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
}



/////////////////////////////////////////////////////////

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

// function readPostsJSON() {
//     const fs = require('fs');
//     const path = '../content/posts.json';
//     const content = fs.readFileSync(path, 'utf-8');

//     const contentObject = JSON.parse(content);

//     return contentObject;
// }

// function writePostsJSON(posts) {
//     const newContent = JSON.stringify(posts, null, 4);

//     const fs = require('fs');
//     const path = '../content/posts.json';

//     fs.writeFileSync(path, newContent, 'utf-8');
// }

// function sha256(input) {
//     const crypto = require('crypto');
//     const hash = crypto.createHash('sha256');
//     hash.update(input);
//     return hash.digest('hex');
// }

//// THE ABOVE CODE WORKS FOR NODE JS (USE FOR TESTING ONLY)
//// THE BELOW CODE WORKS ON BROWSERS

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

/////////////////////////////////////////////////////////