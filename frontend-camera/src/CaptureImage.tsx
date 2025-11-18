import React, { useRef, useState } from "react";

type CaptureImageProps = {
  caption?: string;
  onCaptured?: (base64: string | null) => void;
};

function isMobileDevice(): boolean {
  const ua = navigator.userAgent || "";
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const hasTouch =
    (navigator as any).maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0;

  return mobileRegex.test(ua) || hasTouch;
}

export default function CaptureImage({
  caption = "",
  onCaptured,
}: CaptureImageProps) {
  const mobile = isMobileDevice();

  const inputRefMobile = useRef<HTMLInputElement | null>(null);

  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const handleFile = (file: File) => {
    if (!file) return;
    setBusy(true);
    setStatus("Processing image…");

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result ? reader.result.toString() : null;
      setPreview(base64);
      onCaptured?.(base64);
      setBusy(false);
      setStatus("Ready ✔");
    };
    reader.readAsDataURL(file);
  };

  const openMobileCamera = () => {
    inputRefMobile.current?.click();
  };

  const clear = () => {
    setPreview(null);
    setStatus("");
    if (inputRefMobile.current) inputRefMobile.current.value = "";
  };

  // 💻 DESKTOP VIEW – no camera, just a message
  if (!mobile) {
    return (
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          maxWidth: 520,
        }}
      >
        <strong style={{ display: "block", marginBottom: 8 }}>
          Capture Pantry Image
        </strong>
        <p style={{ margin: 0, color: "#475569", fontSize: 14 }}>
          Camera capture is available only on mobile devices.
          <br />
          Please open MealMingle on your phone to scan your fridge or pantry.
        </p>

        {preview && (
          <figure style={{ marginTop: 12 }}>
            <img
              src={preview}
              alt="Captured pantry"
              style={{
                width: "100%",
                borderRadius: 8,
                border: "1px solid #ddd",
                objectFit: "cover",
              }}
            />
          </figure>
        )}
      </div>
    );
  }

  // 📱 MOBILE VIEW – real camera capture
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        maxWidth: 520,
      }}
    >
      <strong style={{ display: "block", marginBottom: 8 }}>
        Capture Pantry Image
      </strong>

      <p style={{ margin: 0, color: "#475569", fontSize: 14 }}>
        Tap the button below to open your camera and capture your fridge or
        pantry.
      </p>

      <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
        <button onClick={openMobileCamera} disabled={busy}>
          {busy ? "Working…" : "Open Camera"}
        </button>

        {preview && (
          <button
            type="button"
            onClick={clear}
            style={{ color: "#ef4444", marginLeft: "auto" }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Hidden input that actually opens the camera */}
      <input
        ref={inputRefMobile}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {preview && (
        <figure style={{ margin: 0 }}>
          <img
            src={preview}
            alt="Captured pantry"
            style={{
              width: "100%",
              marginTop: 12,
              borderRadius: 8,
              border: "1px solid #ddd",
              objectFit: "cover",
            }}
          />
          {caption && (
            <figcaption
              style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}
            >
              {caption}
            </figcaption>
          )}
        </figure>
      )}

      {status && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#475569" }}>
          {status}
        </div>
      )}
    </div>
  );
}
