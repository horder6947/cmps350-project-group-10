import { getPostsSortChronologically, getUser, likePost as libraryLikePost } from './library.js';

// Run immediately to load the feed
loadFeed();

function loadFeed() {
    let feedContainer = document.getElementById('feed-container');

    // get posts from local storage array in library
    let posts = getPostsSortChronologically();

    // if there are no posts show an example post
    if (posts.length === 0) {
        let exampleHtml = '';
        exampleHtml += '<article class="card post-card">';
        exampleHtml += '  <header class="post-header">';
        exampleHtml += '    <a href="#" class="post-author">@ExampleStudent</a>';
        exampleHtml += '    <span class="post-time">Just now</span>';
        exampleHtml += '  </header>';
        exampleHtml += '  <div class="post-content">';
        exampleHtml += '    <p>Welcome! Once you follow people and they make posts, they will dynamically appear here from localStorage. This is just an example of what a post looks like.</p>';
        exampleHtml += '  </div>';
        exampleHtml += '  <footer class="post-actions">';
        exampleHtml += '    <button class="btn like-btn">Like (0)</button>';
        exampleHtml += '    <button class="btn comment-btn">Comment (0)</button>';
        exampleHtml += '  </footer>';
        exampleHtml += '</article>';

        feedContainer.innerHTML = exampleHtml;
        return;
    }

    // clear the loading text
    feedContainer.innerHTML = '';

    // loop through the posts with a regular for loop
    for (let i = 0; i < posts.length; i++) {
        let post = posts[i];

        let author = getUser(post.authorID);
        // if user was deleted or something
        if (author == null) {
            author = { username: 'UnknownUser' };
        }

        // format the timestamp to readable text
        let postDate = new Date(post.createdTimestamp).toLocaleString();

        let article = document.createElement('article');
        article.className = 'card post-card';

        // building the HTML string using concatenation (old school way)
        let html = '';
        html += '<header class="post-header">';
        html += '  <a href="profile.html?id=' + post.authorID + '" class="post-author">@' + author.username + '</a>';
        html += '  <span class="post-time">' + postDate + '</span>';
        html += '</header>';
        html += '<div class="post-content">';
        html += '  <p>' + post.postContent + '</p>';
        html += '</div>';
        html += '<footer class="post-actions">';
        html += '  <button class="btn like-btn">Like (' + post.likesCount + ')</button>';
        html += '  <button class="btn comment-btn">Comment (' + post.comments.length + ')</button>';
        html += '</footer>';

        article.innerHTML = html;

        // make the like button work for this specific post
        let likeBtn = article.querySelector('.like-btn');
        likeBtn.onclick = function () {
            // using a dummy user for now since login isn't hooked up yet
            libraryLikePost('guest_user', post.postID);
            loadFeed(); // reload to update numbers on screen
        };

        // add the finished post article to the page wrapper
        feedContainer.appendChild(article);
    }
}
