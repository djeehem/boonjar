import React, { useState, useRef } from "react";
import Quagga from "quagga";
import ScanResult from "../ScanResult/ScanResult";

const ScanISBN = () => {
  const videoRef = useRef(null);
  const [isbn, setIsbn] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const successfulDecoder = () =>
    Quagga.onProcessed((result) => {
      console.log(
        `Barcode detected and decoded with ${result.codeResult.format} decoder.`
      );
    });

  const handleScan = (result) => {
    if (result && result.codeResult && result.codeResult.code) {
      successfulDecoder();
      setIsbn(result.codeResult.code);
      stopScan();
    } else {
      alert("ISBN not found. Please try again.");
    }
  };

  const startScan = () => {
    // setIsbn("");
    setIsScanning(true);
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment",
          },
        },
        decoder: {
          readers: ["ean_reader"],
        },
      },
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(handleScan);
  };

  const stopScan = () => {
    setIsScanning(false);
    Quagga.offDetected();
    Quagga.stop();
  };

  return (
    <div>
      <button onClick={startScan}>Scan ISBN</button>
      <button onClick={stopScan}>Stop Scan</button>
      {isScanning && <div className="viewport" ref={videoRef}></div>}
      {/* <p>ISBN: {isbn}</p> */}
      <ScanResult isbn={isbn} />
    </div>
  );
};

export default ScanISBN;
