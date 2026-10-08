import { useEffect, useState } from "react";

import API_URL from "../api/my_api_url";

function EditProfile({ user, onClose, onUpdated }) {
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(user.profile_picture || "");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setProfilePicture(file);

    const imagePreview = URL.createObjectURL(file);

    setPreview(imagePreview);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    const formData = new FormData();

    formData.append("name", name);
    formData.append("username", username);
    formData.append("bio", bio);

    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    try {
      const response = await fetch(`${API_URL}/api/me`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      onUpdated();
      onClose();
    } catch (error) {
      console.error("Update profile error:", error);
      alert("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="edit_profile_overlay">
      <div className="edit_profile_popup">
        <button type="button" className="close_edit_profile" onClick={onClose}>
          ×
        </button>

        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          <div className="edit_profile_picture">
            <img src={preview} alt="Profile preview" />

            <label htmlFor="profile_picture" className="change_picture">
              Change picture
            </label>

            <input
              id="profile_picture"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </div>

          <div className="edit_profile_field">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={30}
            />
          </div>

          <div className="edit_profile_field">
            <label htmlFor="name">Name</label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="edit_profile_field">
            <label htmlFor="bio">Bio</label>

            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={160}
              rows={4}
            />
          </div>

          <button type="submit" className="save_profile" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
