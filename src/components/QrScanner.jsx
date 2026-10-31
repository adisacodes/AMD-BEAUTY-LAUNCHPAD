import { useEffect, useRef, useState } from "react";

// Uses the browser's built-in BarcodeDetector (e.g. Chrome on Android).
export default function QrScanner({ onCode, onClose }) {
  const videoRef = useRef(null);
  const onCodeRef = useRef(onCode);
  const [error, setError] = useState("");

  // Latest callback without restarting the camera on every render.
  useEffect(() => {
    onCodeRef.current = onCode;
  }, [onCode]);

  useEffect(() => {
    let stream;
    let timer;
    let stopped = false;

    async function start() {
      try {
        const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (stopped) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        const tick = async () => {
          if (stopped) return;
          try {
            const [hit] = await detector.detect(videoRef.current);
            if (hit?.rawValue) return onCodeRef.current(hit.rawValue.trim());
          } catch {
            // Frame not ready yet; try again.
          }
          timer = setTimeout(tick, 250);
        };
        tick();
      } catch {
        setError("Camera unavailable. Allow camera access, or type the code instead.");
      }
    }
    start();

    return () => {
      stopped = true;
      clearTimeout(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="scanner glass">
      {error ? (
        <p className="msg error" role="alert">{error}</p>
      ) : (
        <video ref={videoRef} className="scanner-video" muted playsInline aria-label="Camera view for scanning the guest's QR code" />
      )}
      <button type="button" className="btn ghost block" onClick={onClose}>Close scanner</button>
    </div>
  );
}
