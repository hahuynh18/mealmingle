import React, { useState } from "react";
import CaptureImage from "./CaptureImage";

// TODO: change this to your real Railway backend URL
const BACKEND_SCAN_URL = "https://your-backend-host.com/api/inventory/scan";

type ScanResponse = {
  ingredients?: string[];
  // you can add more fields here later, like:
  // confidence?: number;
  // recognizedText?: string;
};

export default function InventoryPage() {
  const [lastBase64, setLastBase64] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCaptured = async (base64: string | null) => {
    setLastBase64(base64);
    setIngredients([]);
    setError(null);

    if (!base64) return;

    try {
      setIsScanning(true);

      const res = await fetch(BACKEND_SCAN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      if (!res.ok) {
        throw new Error(`Scan failed (HTTP ${res.status})`);
      }

      const data: ScanResponse = await res.json();
      setIngredients(data.ingredients ?? []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong while scanning.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <main
      style={{
        padding: 20,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>MealMingle | Inventory Capture</h1>
      <p
        style={{
          marginTop: 0,
          marginBottom: 16,
          color: "#64748b",
          fontSize: 14,
        }}
      >
        Take a photo of your fridge or pantry to detect ingredients and build
        your inventory.
      </p>

      <CaptureImage
        caption="Tip: open the fridge and take a clear, wide shot of all shelves."
        onCaptured={handleCaptured}
      />

      {/* STATUS / RESULTS PANEL */}
      <section
        style={{
          marginTop: 24,
          padding: 16,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          maxWidth: 520,
        }}
      >
        <h2 style={{ fontSize: 18, margin: 0, marginBottom: 8 }}>
          Scan Results
        </h2>

        {isScanning && (
          <p style={{ margin: 0, color: "#0f766e", fontSize: 14 }}>
            🔍 Analyzing your photo… this may take a few seconds.
          </p>
        )}

        {error && (
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              color: "#b91c1c",
              fontSize: 14,
            }}
          >
            ⚠️ {error}
          </p>
        )}

        {!isScanning && !error && lastBase64 && ingredients.length === 0 && (
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              color: "#64748b",
              fontSize: 14,
            }}
          >
            No ingredients were returned from the scanner. You can try another
            photo or add items manually.
          </p>
        )}

        {!lastBase64 && !isScanning && !error && (
          <p style={{ margin: 0, color: "#9ca3af", fontSize: 14 }}>
            Take a photo to see detected ingredients here.
          </p>
        )}

        {ingredients.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <p
              style={{
                margin: 0,
                marginBottom: 4,
                fontSize: 14,
                color: "#374151",
              }}
            >
              ✅ Detected ingredients:
            </p>
            <ul
              style={{
                paddingLeft: 18,
                marginTop: 4,
                marginBottom: 0,
                fontSize: 14,
              }}
            >
              {ingredients.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}
