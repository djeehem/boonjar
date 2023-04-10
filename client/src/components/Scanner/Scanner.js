import React, { useState, useEffect } from "react";
import Quagga from "quagga";

const Scanner = () => {
  const [code, setCode] = useState("");

  const order_by_occurrence = (arr) => {
    const counts = {};

    // Count the occurrences of each value in the array
    arr.forEach((value) => {
      if (!counts[value]) {
        counts[value] = 0;
      }
      counts[value]++;
    });

    // Sort the array in descending order of occurrences
    const sorted = arr.sort((a, b) => {
      return counts[b] - counts[a];
    });

    return sorted;
  };

  useEffect(() => {
    const load_quagga = () => {
      if (
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function"
      ) {
        let last_result = [];
        if (Quagga.initialized === undefined) {
          Quagga.onDetected((result) => {
            let last_code = result.codeResult.code;
            last_result.push(last_code);
            if (last_result.length > 30) {
              console.log(last_result);
              let code = order_by_occurrence(last_result)[0];
              last_result = [];
              Quagga.stop();
              setCode(code);
            }
          });
        }

        Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              numOfWorkers: navigator.hardwareConcurrency,
              target: document.querySelector("#scanner"),
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
            Quagga.initialized = true;
            Quagga.start();
          }
        );
      }
    };

    load_quagga();

    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <div>
      <div id="scanner" />
      {code && <p>The barcode is: {code}</p>}
    </div>
  );
};

export default Scanner;

// import { useSate } from "react";
// import Quagga from "quagga";

// const Scanner = () => {
//   const [isbn, setIsbn] = useState("");

//   const order_by_occurrence = (arr) => {
//     let counts = {};
//     arr.forEach(function (value) {
//       if (!counts[value]) {
//         counts[value] = 0;
//       }
//       counts[value]++;
//     });

//     return Object.keys(counts).sort(function (curKey, nextKey) {
//       return counts[curKey] < counts[nextKey];
//     });
//   };

//   const load_quagga = () => {
//     if (
//       navigator.mediaDevices &&
//       typeof navigator.mediaDevices.getUserMedia === "function"
//     ) {
//       let last_result = [];
//       if (Quagga.initialized == undefined) {
//         Quagga.onDetected(function (result) {
//           let last_code = result.codeResult.code;
//           last_result.push(last_code);
//           if (last_result.length > 20) {
//             code = order_by_occurrence(last_result)[0];
//             last_result = [];
//             Quagga.stop();
//             setIsbn(code);
//           }
//         });
//       }

//       Quagga.init(
//         {
//           inputStream: {
//             name: "Live",
//             type: "LiveStream",
//             numOfWorkers: navigator.hardwareConcurrency,
//             target: document.querySelector("#barcode-scanner"),
//           },
//           decoder: {
//             readers: [
//               "ean_reader",
//               "ean_8_reader",
//               "code_39_reader",
//               "code_39_vin_reader",
//               "codabar_reader",
//               "upc_reader",
//               "upc_e_reader",
//             ],
//           },
//         },
//         function (err) {
//           if (err) {
//             console.log(err);
//             return;
//           }
//           Quagga.initialized = true;
//           Quagga.start();
//         }
//       );
//     }
//   };

//   return;
// };

// export default Scanner;
