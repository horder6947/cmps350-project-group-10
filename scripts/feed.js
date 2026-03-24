import {
    initializeUsers,
    initializePosts,
    getUser,
    sortPostsChronologically,
    sortPostsByComments,
    sortPostsByLikes,
    getFollowingPosts,
    getAllPosts,
    likePost,
    removeLike,
    commentOnPost,
    deletePost
} from "./library.js";

if (!localStorage.getItem('users')) {
    await initializeUsers();
}

if (!localStorage.getItem('posts')) {
    await initializePosts();
}

loadFeed();

function getCurrentUserID() {

    const storedUserID = localStorage.getItem("currentUserID");
    if (storedUserID && getUser(storedUserID)) {
        return storedUserID;
    }

    return null;
}

function loadFeed() {
    const currentUserID = getCurrentUserID();
    let feedContainer = document.getElementById('feed-container');
    let posts;

    if (currentUserID)
        posts = sortPostsChronologically(getFollowingPosts(currentUserID));
    else
        posts = sortPostsChronologically(getAllPosts());

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

    feedContainer.innerHTML = '';

    for (let i = 0; i < posts.length; i++) {
        let post = posts[i];
        let author = getUser(post.authorID);

        if (author == null) {
            author = { username: 'UnknownUser' };
        }

        let postDate = new Date(post.createdTimestamp).toLocaleString();
        const hasLiked = currentUserID ? post.likes.includes(currentUserID) : false;

        let article = document.createElement('article');
        article.className = 'card post-card';

        let html = '';
        html += '<header class="post-header">';
        html += '  <a href="profile.html?userid=' + post.authorID + '" class="post-author">@' + author.username + '</a>';
        html += '  <span class="post-time">' + postDate + '</span>';
        html += '</header>';
        html += '<div class="post-content">';
        html += '  <p>' + post.postContent + '</p>';
        html += '</div>';
        html += '<footer class="post-actions">';
        html += '  <button class="btn like-btn">' + (hasLiked ? 'Unlike' : 'Like') + ' (' + post.likesCount + ')</button>';
        html += '  <button class="btn comment-btn">Comment (' + post.comments.length + ')</button>';
        if (currentUserID && currentUserID === post.authorID) {
            html += '  <button class="btn delete-btn">Delete</button>';
        }
        html += '</footer>';
        html += '<div class="comments-container"></div>';

        article.innerHTML = html;

        let likeBtn = article.querySelector('.like-btn');
        let commentBtn = article.querySelector('.comment-btn');
        let commentsContainer = article.querySelector('.comments-container');

        renderComments(post, commentsContainer);

        likeBtn.onclick = function () {
            if (!currentUserID) {
                alert('No active user found.');
                return;
            }

            if (post.likes.includes(currentUserID)) {
                removeLike(currentUserID, post.postID);
            } else {
                likePost(currentUserID, post.postID);
            }

            loadFeed();
        };

        commentBtn.onclick = function () {
            if (!currentUserID) {
                alert('No active user found.');
                return;
            }

            const commentText = prompt('Write your comment:');
            if (commentText === null) return;

            if (!commentText.trim()) {
                alert('Comment cannot be empty.');
                return;
            }

            commentOnPost(currentUserID, post.postID, commentText);
            loadFeed();
        };

        let deleteBtn = article.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.onclick = function () {
                const confirmed = confirm('Delete this post?');
                if (!confirmed) return;

                deletePost(post.postID);
                loadFeed();
            };
        }

        feedContainer.appendChild(article);
    }
}

function renderComments(post, container) {
    if (!post.comments || post.comments.length === 0) {
        container.innerHTML = '';
        return;
    }

    let commentsHtml = '<div class="comments-list">';

    for (let i = 0; i < post.comments.length; i++) {
        const commentItem = post.comments[i];
        const commentAuthor = getUser(commentItem.authorID);
        const username = commentAuthor ? commentAuthor.username : 'UnknownUser';

        commentsHtml += '<p class="comment-item"><strong>@' + username + ':</strong> ' + commentItem.comment + '</p>';
    }

    commentsHtml += '</div>';
    container.innerHTML = commentsHtml;
}
