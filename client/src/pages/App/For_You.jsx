import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faPlay,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

const posts = [
  {
    id: 1,
    username: "@maya",
    profile: "https://i.pravatar.cc/150?img=47",
    title: "Post title",
    subtitle: "Short description about the post.",
    mediaType: "image",
    mediaUrl:
      "https://i.pinimg.com/1200x/b6/3d/aa/b63daac57b327184e828f89662968a5f.jpg",
  },
  {
    id: 2,
    username: "@jordan",
    profile: "https://i.pravatar.cc/150?img=12",
    title: "Another post",
    subtitle: "Another description.",
    mediaType: "video",
    mediaUrl: "https://youtu.be/2sIhJFwiaqc?si=JWPi2Z78iGw7IUIL",
  },
];

const getYouTubeVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace("www.", "");

    if (hostname === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0];
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      return parsedUrl.searchParams.get("v");
    }

    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
    return ["embed", "shorts", "live"].includes(pathParts[0])
      ? pathParts[1]
      : null;
  } catch {
    return null;
  }
};

const getYouTubeEmbedUrl = (url) => {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) return null;

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
};

function For_You() {
  const [likedPosts, setLikedPosts] = useState([]);
  const [playingVideos, setPlayingVideos] = useState([]);
  const videoRefs = useRef({});

  const toggleLike = (postId) => {
    setLikedPosts((current) =>
      current.includes(postId)
        ? current.filter((id) => id !== postId)
        : [...current, postId],
    );
  };

  const toggleVideo = async (postId) => {
    const video = videoRefs.current[postId];

    if (!video) return;

    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  };

  const rewindVideo = (postId) => {
    const video = videoRefs.current[postId];

    if (!video) return;

    video.currentTime = Math.max(0, video.currentTime - 10);
    video.play().catch(() => undefined);
  };

  const updateVideoPlayback = (postId, isPlaying) => {
    setPlayingVideos((current) =>
      isPlaying
        ? [...new Set([...current, postId])]
        : current.filter((id) => id !== postId),
    );
  };

  return (
    <section id="for_you" aria-label="Discover posts">
      {posts.map((post) => {
        const liked = likedPosts.includes(post.id);

        return (
          <article className="discover_post" key={post.id}>
            <div className="media">
              {post.mediaType === "video" ? (
                <div className="video_media">
                  {getYouTubeEmbedUrl(post.mediaUrl) ? (
                    <iframe
                      className="media_content youtube_video"
                      src={getYouTubeEmbedUrl(post.mediaUrl)}
                      title={`${post.username}'s video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      onLoad={() => updateVideoPlayback(post.id, true)}
                    />
                  ) : (
                    <video
                      ref={(element) => {
                        if (element) videoRefs.current[post.id] = element;
                        else delete videoRefs.current[post.id];
                      }}
                      className="media_content"
                      src={post.mediaUrl}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      autoPlay
                      aria-label={`${post.username}'s post video`}
                      onClick={() => toggleVideo(post.id)}
                      onPlay={() => updateVideoPlayback(post.id, true)}
                      onPause={() => updateVideoPlayback(post.id, false)}
                      onEnded={() => updateVideoPlayback(post.id, false)}
                    />
                  )}

                  {!playingVideos.includes(post.id) && (
                    <button
                      className="video_play_button"
                      type="button"
                      aria-label={`Play ${post.username}'s video`}
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleVideo(post.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faPlay} />
                    </button>
                  )}

                  {getYouTubeEmbedUrl(post.mediaUrl) ? null : (
                    <button
                      className="video_rewind_button"
                      type="button"
                      aria-label="Rewind video by 10 seconds"
                      onClick={(event) => {
                        event.stopPropagation();
                        rewindVideo(post.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faRotateLeft} />
                      <span>10s</span>
                    </button>
                  )}
                </div>
              ) : (
                <img
                  className="media_content"
                  src={post.mediaUrl}
                  alt={post.title}
                />
              )}

              <div className="post_overlay">
                <div className="post_details">
                  <img
                    className="post_profile_image"
                    src={post.profile}
                    alt=""
                  />
                  <div className="post_copy">
                    <p className="post_handle">{post.username}</p>
                    <h2>{post.title}</h2>
                    <p className="post_subtitle">{post.subtitle}</p>
                  </div>
                </div>

                <button
                  className={`like_button${liked ? " liked" : ""}`}
                  type="button"
                  aria-label={
                    liked
                      ? `Unlike ${post.username}'s post`
                      : `Like ${post.username}'s post`
                  }
                  aria-pressed={liked}
                  onClick={() => toggleLike(post.id)}
                >
                  <FontAwesomeIcon icon={faBolt} />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default For_You;
