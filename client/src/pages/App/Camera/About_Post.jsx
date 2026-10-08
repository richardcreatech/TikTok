import { useEffect, useMemo, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import API_URL from "../../../api/my_api_url";

function dataUrlToBlob(dataUrl) {
  const [metadata, encodedData] = dataUrl.split(",");

  const mimeType =
    metadata.match(/data:([^;]+)/)?.[1] || "image/jpeg";

  const binary = atob(encodedData);

  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], {
    type: mimeType,
  });
}

function About_Post() {
  const location = useLocation();
  const navigate = useNavigate();

  const photo = location.state?.photo;
  const uploadedMedia = location.state?.media;

  const [caption, setCaption] = useState("");
  const [subcaption, setSubcaption] = useState("");

  const [status, setStatus] = useState("idle");

  const mediaType =
    uploadedMedia?.type || (photo ? "image" : "");

  const mediaUrl = useMemo(() => {
    if (uploadedMedia?.source instanceof File) {
      return URL.createObjectURL(uploadedMedia.source);
    }

    return photo || null;
  }, [photo, uploadedMedia]);

  useEffect(() => {
    return () => {
      if (
        uploadedMedia?.source instanceof File &&
        mediaUrl
      ) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [mediaUrl, uploadedMedia]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!mediaUrl) {
      return;
    }

    setStatus("submitting");

    try {
      const formData = new FormData();

      let mediaFile;

      if (photo) {
        mediaFile = dataUrlToBlob(photo);
      } else if (uploadedMedia?.source instanceof File) {
        mediaFile = uploadedMedia.source;
      }

      if (!mediaFile) {
        setStatus("error");
        return;
      }

      /*
        This MUST be "media" because
        the backend uses:

        upload.single("media")
      */
      formData.append(
        "media",
        mediaFile,
        uploadedMedia?.fileName ||
          `post-${Date.now()}`
      );

      formData.append(
        "caption",
        caption.trim()
      );

      formData.append(
        "subcaption",
        subcaption.trim()
      );

      const response = await fetch(
        `${API_URL}/api/posts`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);

        setStatus("error");
        return;
      }

      console.log("Post created:", data.post);

      setStatus("success");

      navigate("/en", {
        replace: true,
      });

    } catch (error) {
      console.error("Create post error:", error);

      setStatus("error");

    }
  };

  if (!mediaUrl) {
    return (
      <section className="about_post">
        <div className="about_post__content">
          <h1>Add a photo or video</h1>

          <p>
            Take a photo or choose one from your device,
            then continue to add the post details.
          </p>

          <button
            type="button"
            onClick={() => navigate("/en/upload")}
          >
            Open camera
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="about_post">
      <div className="about_post__content">

        <header className="about_post__header">
          <div>
            <p className="about_post__eyebrow">
              New post
            </p>

            <h1>
              Tell us about your {mediaType}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/en/upload")}
          >
            Choose another media
          </button>
        </header>

        <div className="about_post__layout">

          {mediaType === "video" ? (
            <video
              className="about_post__preview"
              src={mediaUrl}
              controls
              playsInline
            />
          ) : (
            <img
              className="about_post__preview"
              src={mediaUrl}
              alt="Photo selected for your post"
            />
          )}

          <form
            className="about_post__form"
            onSubmit={handleSubmit}
          >

            <label htmlFor="post-caption">
              Caption
            </label>

            <input
              id="post-caption"
              value={caption}
              onChange={(event) =>
                setCaption(event.target.value)
              }
              placeholder="Give your post a caption"
              maxLength={120}
              required
            />

            <label htmlFor="post-subcaption">
              Subcaption
            </label>

            <textarea
              id="post-subcaption"
              value={subcaption}
              onChange={(event) =>
                setSubcaption(event.target.value)
              }
              placeholder="Add a little more about your post..."
              maxLength={500}
              rows="5"
            />

            {status === "error" && (
              <p className="about_post__error">
                The post could not be sent. Please try
                again.
              </p>
            )}

            <button
              className="about_post__submit"
              type="submit"
              disabled={status === "submitting"}
            >
              {status === "submitting"
                ? "Posting…"
                : `Post ${mediaType}`}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}

export default About_Post;