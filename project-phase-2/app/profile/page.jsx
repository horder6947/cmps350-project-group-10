"use client";

import { useState } from "react";
import Link from "next/link";
import TopNav from "@/app/components/TopNav";

const initialProfile = {
  username: "",
  userID: "",
  email: "",
  bio: "",
  followersCount: 0,
  followingCount: 0,
  postsCount: 0,
};

export default function Page() {
  const [profile, setProfile] = useState(initialProfile);
  const [showModal, setShowModal] = useState(false);
  const [editUsername, setEditUsername] = useState(initialProfile.username);
  const [editBio, setEditBio] = useState(initialProfile.bio);

  function saveProfile(event) {
    event.preventDefault();
    if (!editUsername.trim()) {
      return;
    }

    setProfile((old) => ({
      ...old,
      username: editUsername.trim(),
      bio: editBio.trim(),
    }));
    setShowModal(false);
  }

  return (
    <div className="profile-page">
      <TopNav activePath="/profile" />
      <main className="container app">
        <section className="card profile-card">
          <div className="cover" />
          <div className="profile-body">
            <div className="avatar-row">
              <div className="avatar" id="pfpText">
                {profile.username?.[0] || ""}
              </div>
              <div className="profile-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  id="editProfileBtn"
                  onClick={() => setShowModal(true)}
                >
                  Edit profile
                </button>
                <Link className="btn btn-secondary" href="/feed">
                  View feed
                </Link>
              </div>
            </div>

            <div id="editModal" className="modal" hidden={!showModal}>
              <div className="modal-content">
                <h3>Edit profile</h3>
                <form id="editProfileForm" onSubmit={saveProfile}>
                  <label htmlFor="editUsername">Username</label>
                  <input
                    type="text"
                    id="editUsername"
                    required
                    minLength={1}
                    value={editUsername}
                    onChange={(event) => setEditUsername(event.target.value)}
                  />
                  <label htmlFor="editBio">Bio</label>
                  <textarea
                    id="editBio"
                    rows={3}
                    value={editBio}
                    onChange={(event) => setEditBio(event.target.value)}
                  />
                  <div className="modal-actions">
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      id="cancelEditBtn"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="profile-info">
              <h1 id="username">{profile.username}</h1>
              <p id="userid">@{profile.userID}</p>
              <p className="email" id="email">
                {profile.email}
              </p>
            </div>

            <div className="bio">
              <p id="bio">{profile.bio}</p>
            </div>

            <div className="stats">
              <div className="stat">
                <p id="followersCount">{profile.followersCount}</p>
                <span>Followers</span>
              </div>
              <div className="stat">
                <p id="followingCount">{profile.followingCount}</p>
                <span>Following</span>
              </div>
              <div className="stat">
                <p id="postsCount">{profile.postsCount}</p>
                <span>Posts</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
