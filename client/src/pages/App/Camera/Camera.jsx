import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// ─────────────────────────────────────────────────────────────
// FILTER ARTWORK — replace these with your own transparent PNG/SVG files.
// Change the paths to wherever you keep your assets.
// ─────────────────────────────────────────────────────────────
// import bunnyFilter from "../../assets/filters/bunny.png";
// import friesFilter from "../../assets/filters/fries.png";
// import heartFilter from "../../assets/filters/heart.png";
// import crownFilter from "../../assets/filters/crown.png";
// import catEarsFilter from "../../assets/filters/cat-ears.png";
// import catWhiskersFilter from "../../assets/filters/cat-whiskers.png";
// import glassesFilter from "../../assets/filters/glasses.png";

// ─────────────────────────────────────────────────────────────
// FILTERS
// Each filter has a thumbnail and one or more `parts`.
//   anchor : "head" | "eyes" | "nose" | "orbit"
//   width  : sticker width as a multiple of the face width
//   offset : nudge along the head's "up" direction, in face widths
//            (positive = up, negative = down)
//   count  : only for "orbit" — how many copies float around the face
// To add a filter, add another object to this array.
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// TEMPORARY PLACEHOLDERS — delete this block and restore the real
// imports once you have your own artwork:
//   import bunnyFilter from "../../assets/filters/bunny.png"; ...
// ─────────────────────────────────────────────────────────────
const svgUri = (w, h, body) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`,
  );

const placeholderFilters = [
  {
    name: "bunnyFilter",
    uri: svgUri(
      200,
      140,
      `
      <ellipse cx="62" cy="72" rx="24" ry="66" fill="#fff" stroke="#f0cddb" stroke-width="3" transform="rotate(-8 62 72)"/>
      <ellipse cx="62" cy="76" rx="11" ry="46" fill="#ffb3cb" transform="rotate(-8 62 72)"/>
      <ellipse cx="138" cy="72" rx="24" ry="66" fill="#fff" stroke="#f0cddb" stroke-width="3" transform="rotate(8 138 72)"/>
      <ellipse cx="138" cy="76" rx="11" ry="46" fill="#ffb3cb" transform="rotate(8 138 72)"/>`,
    ),
  },
  {
    name: "friesFilter",
    uri: svgUri(
      200,
      150,
      `
      <rect x="40" y="14" width="20" height="95" rx="8" fill="#ffd35a"/>
      <rect x="66" y="4" width="20" height="105" rx="8" fill="#ffe27d"/>
      <rect x="92" y="18" width="20" height="92" rx="8" fill="#ffd35a"/>
      <rect x="118" y="6" width="20" height="104" rx="8" fill="#ffe27d"/>
      <rect x="144" y="20" width="20" height="90" rx="8" fill="#ffd35a"/>
      <path d="M26 82 H174 L158 148 H42 Z" fill="#e8465a"/>
      <path d="M26 82 H174 L170 98 H30 Z" fill="#fff3d6"/>`,
    ),
  },
  {
    name: "heartFilter",
    uri: svgUri(
      100,
      100,
      `
      <path d="M50 90 C8 60 4 30 25 19 C38 13 48 20 50 31 C52 20 62 13 75 19 C96 30 92 60 50 90Z" fill="#ff5c8a"/>
      <ellipse cx="30" cy="34" rx="7" ry="5" fill="#fff" opacity=".6" transform="rotate(-30 30 34)"/>`,
    ),
  },
  {
    name: "crownFilter",
    uri: svgUri(
      180,
      110,
      `
      <path d="M10 100 L10 30 L50 62 L90 8 L130 62 L170 30 L170 100 Z" fill="#ffc93c" stroke="#f0a91c" stroke-width="4" stroke-linejoin="round"/>
      <rect x="10" y="84" width="160" height="16" fill="#f0a91c"/>
      <circle cx="10" cy="28" r="8" fill="#ff7da8"/>
      <circle cx="90" cy="8" r="9" fill="#ff7da8"/>
      <circle cx="170" cy="28" r="8" fill="#ff7da8"/>`,
    ),
  },
  {
    name: "catEarsFilter",
    uri: svgUri(
      200,
      100,
      `
      <path d="M15 100 L28 8 L88 100Z" fill="#ffb86b" stroke="#e89a45" stroke-width="3" stroke-linejoin="round"/>
      <path d="M33 92 L39 34 L68 92Z" fill="#ffd6e0"/>
      <path d="M185 100 L172 8 L112 100Z" fill="#ffb86b" stroke="#e89a45" stroke-width="3" stroke-linejoin="round"/>
      <path d="M167 92 L161 34 L132 92Z" fill="#ffd6e0"/>`,
    ),
  },
  {
    name: "catWhiskersFilter",
    uri: svgUri(
      300,
      100,
      `
      <g stroke="#40294a" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M118 46 L12 26"/><path d="M118 52 L4 52"/><path d="M118 58 L12 80"/>
        <path d="M182 46 L288 26"/><path d="M182 52 L296 52"/><path d="M182 58 L288 80"/>
      </g>
      <ellipse cx="150" cy="50" rx="11" ry="8" fill="#ff7da8"/>`,
    ),
  },
  {
    name: "glassesFilter",
    uri: svgUri(
      220,
      80,
      `
      <rect x="8" y="10" width="88" height="56" rx="24" fill="#40294a"/>
      <rect x="124" y="10" width="88" height="56" rx="24" fill="#40294a"/>
      <path d="M96 26 Q110 16 124 26" stroke="#40294a" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M22 24 L44 24" stroke="#ff9ec0" stroke-width="6" stroke-linecap="round"/>
      <path d="M138 24 L160 24" stroke="#ff9ec0" stroke-width="6" stroke-linecap="round"/>`,
    ),
  },
];

// Pull each one out under the same name your real imports use
const [
  bunnyFilter,
  friesFilter,
  heartFilter,
  crownFilter,
  catEarsFilter,
  catWhiskersFilter,
  glassesFilter,
] = placeholderFilters.map((filter) => filter.uri);

const filters = [
  {
    id: "bunny",
    name: "Bunny",
    thumb: bunnyFilter,
    parts: [{ image: bunnyFilter, anchor: "head", width: 1.15, offset: -0.05 }],
  },
  {
    id: "fries",
    name: "Fries",
    thumb: friesFilter,
    parts: [{ image: friesFilter, anchor: "head", width: 1.0, offset: -0.05 }],
  },
  {
    id: "hearts",
    name: "Hearts",
    thumb: heartFilter,
    parts: [{ image: heartFilter, anchor: "orbit", width: 0.2, count: 6 }],
  },
  {
    id: "crown",
    name: "Crown",
    thumb: crownFilter,
    parts: [{ image: crownFilter, anchor: "head", width: 0.9, offset: 0.02 }],
  },
  {
    id: "cat",
    name: "Cat",
    thumb: catEarsFilter,
    parts: [
      { image: catEarsFilter, anchor: "head", width: 1.05, offset: -0.02 },
      { image: catWhiskersFilter, anchor: "nose", width: 1.7, offset: 0 },
    ],
  },
  {
    id: "glasses",
    name: "Shades",
    thumb: glassesFilter,
    parts: [{ image: glassesFilter, anchor: "eyes", width: 1.05, offset: 0 }],
  },
];

const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

// 0 = frozen, 1 = no smoothing. Lower values feel floatier but lag more.
const SMOOTHING = 0.45;

// ─────────────────────────────────────────────────────────────
// Helpers (plain functions, not components)
// ─────────────────────────────────────────────────────────────

// Turn the raw landmarks into the few numbers the stickers need (in video pixels).
function measureFace(landmarks, w, h) {
  const p = (i) => ({ x: landmarks[i].x * w, y: landmarks[i].y * h });
  const rightEye = p(33);
  const leftEye = p(263);
  const cheekA = p(234);
  const cheekB = p(454);
  const forehead = p(10);
  const nose = p(1);

  return {
    width: Math.hypot(cheekB.x - cheekA.x, cheekB.y - cheekA.y),
    // Tilt of the line between the eyes = head roll
    roll: Math.atan2(leftEye.y - rightEye.y, leftEye.x - rightEye.x),
    headX: forehead.x,
    headY: forehead.y,
    eyesX: (rightEye.x + leftEye.x) / 2,
    eyesY: (rightEye.y + leftEye.y) / 2,
    noseX: nose.x,
    noseY: nose.y,
  };
}

function smooth(prev, next) {
  if (!prev) return next;
  const out = {};
  for (const key in next)
    out[key] = prev[key] + (next[key] - prev[key]) * SMOOTHING;
  return out;
}

// Draw one image at (x, y), rotated, with either its center or bottom-center on the point.
function drawImageAt(ctx, img, x, y, width, rotation, pivot) {
  const height = (width * img.naturalHeight) / img.naturalWidth;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.drawImage(
    img,
    -width / 2,
    pivot === "bottom" ? -height : -height / 2,
    width,
    height,
  );
  ctx.restore();
}

function drawFilter(ctx, filter, images, face, time) {
  // Direction pointing "up" through the top of the head, taking tilt into account
  const up = { x: Math.sin(face.roll), y: -Math.cos(face.roll) };

  filter.parts.forEach((part) => {
    const img = images[part.image];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const size = part.width * face.width;

    if (part.anchor === "orbit") {
      // Hearts drift in a slow loop around the face and bob a little
      for (let i = 0; i < part.count; i++) {
        const angle =
          face.roll + (i / part.count) * Math.PI * 2 + time * 0.0007;
        const bob = Math.sin(time * 0.004 + i * 1.7) * 0.04 * face.width;
        const x = face.noseX + Math.cos(angle) * face.width * 0.85;
        const y = face.noseY + Math.sin(angle) * face.width * 1.0 + bob;
        drawImageAt(ctx, img, x, y, size, 0, "center");
      }
      return;
    }

    const anchorX = face[`${part.anchor}X`];
    const anchorY = face[`${part.anchor}Y`];
    const push = (part.offset || 0) * face.width;
    // Things worn on the head stand on the forehead; everything else is centered on its point
    const pivot = part.anchor === "head" ? "bottom" : "center";

    drawImageAt(
      ctx,
      img,
      anchorX + up.x * push,
      anchorY + up.y * push,
      size,
      face.roll,
      pivot,
    );
  });
}

async function createLandmarker() {
  const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
  const create = (delegate) =>
    FaceLandmarker.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate },
      runningMode: "VIDEO",
      numFaces: 1,
    });
  try {
    return await create("GPU");
  } catch {
    return await create("CPU"); // some browsers don't support the GPU delegate
  }
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// onClose : called by the back button (defaults to browser back)
// onUse   : receives the finished photo as a data URL
//           (defaults to downloading it so you can test)
// ─────────────────────────────────────────────────────────────
export default function Camera({ onClose, onUse }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const faceRef = useRef(null);
  const faceFoundRef = useRef(false);
  const lastVideoTimeRef = useRef(-1);
  const imagesRef = useRef({});
  const filterRef = useRef(null);

  const [status, setStatus] = useState("loading"); // loading | ready | denied | error
  const [attempt, setAttempt] = useState(0); // bump to retry the camera
  const [trackerFailed, setTrackerFailed] = useState(false);
  const [ratio, setRatio] = useState(4 / 3);
  const [selectedId, setSelectedId] = useState(null);
  const [faceFound, setFaceFound] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [flash, setFlash] = useState(false);
  const navigate = useNavigate();

  const selectedFilter = filters.find((f) => f.id === selectedId) || null;

  // The animation loop reads the filter from a ref so it never has to restart
  useEffect(() => {
    filterRef.current = selectedFilter;
  }, [selectedFilter]);

  // Preload every sticker image once
  useEffect(() => {
    filters.forEach((filter) =>
      filter.parts.forEach((part) => {
        if (imagesRef.current[part.image]) return;
        const img = new Image();
        img.src = part.image;
        imagesRef.current[part.image] = img;
      }),
    );
  }, []);

  // Start the camera + face tracker, run the render loop, clean everything up on exit
  useEffect(() => {
    let cancelled = false;
    const activeVideo = videoRef.current;

    const loop = (time) => {
      rafRef.current = requestAnimationFrame(loop);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2 || video.paused) return;

      // Keep the overlay the same size as the video so coordinates line up 1:1
      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      // Only run detection when the camera has produced a new frame
      const tracker = landmarkerRef.current;
      if (tracker && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        const result = tracker.detectForVideo(video, time);
        const landmarks = result.faceLandmarks[0];

        faceRef.current = landmarks
          ? smooth(
              faceRef.current,
              measureFace(landmarks, canvas.width, canvas.height),
            )
          : null;

        const found = Boolean(landmarks);
        if (found !== faceFoundRef.current) {
          faceFoundRef.current = found;
          setFaceFound(found);
        }
      }

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (filterRef.current && faceRef.current) {
        drawFilter(
          ctx,
          filterRef.current,
          imagesRef.current,
          faceRef.current,
          time,
        );
      }
    };

    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error("unsupported");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        activeVideo.srcObject = stream;
        await activeVideo.play();
        setRatio(activeVideo.videoWidth / activeVideo.videoHeight);
      } catch (err) {
        if (cancelled) return;
        const denied =
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError";
        setStatus(denied ? "denied" : "error");
        return;
      }

      try {
        const landmarker = await createLandmarker();
        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;
      } catch (err) {
        console.error("Face tracker failed to load", err);
        if (!cancelled) setTrackerFailed(true);
      }

      if (cancelled) return;
      setStatus("ready");
      rafRef.current = requestAnimationFrame(loop);
    };

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
      faceRef.current = null;
      faceFoundRef.current = false;
      lastVideoTimeRef.current = -1;
      if (activeVideo) activeVideo.srcObject = null;
    };
  }, [attempt]);

  const takePhoto = () => {
    const video = videoRef.current;
    const overlay = canvasRef.current;
    if (!video || !overlay || status !== "ready") return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    const ctx = out.getContext("2d");

    // Flip horizontally so the photo matches the mirrored preview,
    // then draw the camera frame and the sticker layer on top of it.
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.drawImage(overlay, 0, 0, w, h);

    setPhoto(out.toDataURL("image/jpeg", 0.92));
    video.pause();
    setFlash(true);
  };

  const retake = () => {
    setPhoto(null);
    videoRef.current?.play();
  };

  const usePhoto = () => {
    if (!photo) return;

    if (onUse) {
      onUse(photo);
      return;
    }

    navigate("/en/about_post", { state: { photo } });
  };

  const selectMedia = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) return;

    navigate("/en/about_post", {
      state: {
        media: {
          type: isVideo ? "video" : "image",
          source: file,
          fileName: file.name,
          mimeType: file.type,
        },
      },
    });
  };

  const close = () => (onClose ? onClose() : window.history.back());

  return (
    <main className="camera">
      <button
        className="camera__back"
        type="button"
        onClick={close}
        aria-label="Go back"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M15 5l-7 7 7 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="camera__stage" style={{ "--ratio": ratio }}>
        <div className="camera__viewport">
          <video className="camera__video" ref={videoRef} playsInline muted />
          <canvas className="camera__overlay" ref={canvasRef} />

          {photo && (
            <img className="camera__photo" src={photo} alt="Your photo" />
          )}
          {flash && (
            <div
              className="camera__flash"
              onAnimationEnd={() => setFlash(false)}
            />
          )}

          {status === "ready" &&
            !photo &&
            selectedFilter &&
            !faceFound &&
            !trackerFailed && (
              <p className="camera__peek">Peek into the frame 👀</p>
            )}

          {status === "loading" && (
            <div className="camera__message">
              <span className="camera__bunny" aria-hidden="true">
                🐰
              </span>
              <p>Warming up your camera…</p>
            </div>
          )}

          {status === "denied" && (
            <div className="camera__message">
              <span aria-hidden="true">🙈</span>
              <h2>We need your camera</h2>
              <p>
                Gamani can't take photos without camera access. Allow it from
                the lock icon in your browser's address bar, then try again.
              </p>
              <button
                className="camera__pill"
                type="button"
                onClick={() => setAttempt((n) => n + 1)}
              >
                Try again
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="camera__message">
              <span aria-hidden="true">😿</span>
              <h2>Camera not available</h2>
              <p>
                We couldn't start a camera. Check that no other app is using it
                and that you're on a secure (https) page.
              </p>
              <button
                className="camera__pill"
                type="button"
                onClick={() => setAttempt((n) => n + 1)}
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="camera__controls">
        {photo ? (
          <div className="camera__actions">
            <button
              className="camera__pill camera__pill--soft"
              type="button"
              onClick={retake}
            >
              Retake
            </button>
            <button className="camera__pill" type="button" onClick={usePhoto}>
              Post
            </button>
          </div>
        ) : (
          <>
            {trackerFailed && (
              <p className="camera__note">
                Face tracking isn't available, but you can still snap a photo.
              </p>
            )}

            <div className="camera__filters">
              <button
                type="button"
                className="camera__filter camera__filter--none"
                aria-pressed={selectedId === null}
                aria-label="No filter"
                onClick={() => setSelectedId(null)}
              >
                <span aria-hidden="true">✕</span>
              </button>
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className="camera__filter"
                  aria-pressed={selectedId === filter.id}
                  aria-label={filter.name}
                  onClick={() => setSelectedId(filter.id)}
                >
                  <img src={filter.thumb} alt="" draggable="false" />
                </button>
              ))}
            </div>

            <p className="camera__filter-name">
              {selectedFilter ? selectedFilter.name : "No filter"}
            </p>

            <div className="camera__upload-actions">
              <label className="camera__upload-button">
                Upload photos or videos
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={selectMedia}
                />
              </label>
            </div>

            <button
              className="camera__shutter"
              type="button"
              onClick={takePhoto}
              disabled={status !== "ready"}
              aria-label="Take photo"
            />
          </>
        )}
      </div>
    </main>
  );
}
