"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TopNav from "@/app/components/TopNav";
import { readSession, writeSession } from "@/lib/session";

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
  const [error, setError] = useState("");

  useEffect(() => {
    const session = readSession();
    if (!session?.id) {
      setError("Please log in first.");
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(session.id)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setProfile({
          username: data.username ?? "",
          userID: data.id ?? "",
          email: data.email ?? "",
          bio: data.bio ?? "",
          followersCount: data.followersCount ?? 0,
          followingCount: data.followingCount ?? 0,
          postsCount: data.postsCount ?? 0,
        });
        setEditUsername(data.username ?? "");
        setEditBio(data.bio ?? "");
      } catch (err) {
        if (!cancelled) setError(err?.message || "Unable to load profile");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveProfile(event) {
    event.preventDefault();
    if (!editUsername.trim()) return;
    const session = readSession();
    if (!session?.id) {
      setError("Please log in first.");
      return;
    }

    try {
      const res = await fetch(`/api/users/${encodeURIComponent(session.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editUsername.trim(),
          bio: editBio.trim(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProfile({
        username: data.username ?? "",
        userID: data.id ?? "",
        email: data.email ?? "",
        bio: data.bio ?? "",
        followersCount: data.followersCount ?? 0,
        followingCount: data.followingCount ?? 0,
        postsCount: data.postsCount ?? 0,
      });
      writeSession({
        id: data.id,
        username: data.username,
        email: data.email,
        bio: data.bio,
      });
      setShowModal(false);
      setError("");
    } catch (err) {
      setError(err?.message || "Unable to save profile");
    }
  }

  return (
    <div className="profile-page">
      <TopNav activePath="/profile" />
      <main className="container app">
        {error ? <p className="error-visible">{error}</p> : null}
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
