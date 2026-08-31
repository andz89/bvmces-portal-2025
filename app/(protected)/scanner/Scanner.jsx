"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import ScanResultModal from "./ScanResultModal";

export default function QrScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleScan = (detectedCodes) => {
    const code = detectedCodes[0];

    if (!code) return;

    console.log("Detected:", code);

    setScanResult({
      rawValue: code.rawValue,
    });

    // Stop the camera after successful scan
    // setIsScanning(false);
  };

  const handleError = (error) => {
    console.error("Scanner error:", error);
  };

  return (
    <div className="mt-5">
      <div className="flex flex-col items-center justify-center gap-1">
        <button
          onClick={() => setIsScanning((prev) => !prev)}
          className="rounded bg-black px-4 py-2 text-white"
        >
          {isScanning ? "Stop Camera" : "Start Camera"}
        </button>

        {isScanning && (
          <div className="mt-4 w-full max-w-[400px]">
            <Scanner onScan={handleScan} onError={handleError} />
          </div>
        )}
      </div>

      <ScanResultModal
        result={scanResult}
        onClose={() => setScanResult(null)}
      />
    </div>
  );
}
