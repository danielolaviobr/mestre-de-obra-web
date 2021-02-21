import LoadingSpinner from "@components/shared/LoadingSpinner";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useGesture } from "react-use-gesture";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDF = () => {
  const pdfRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [numPages, setNumPages] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });
  useGesture(
    {
      onPinch: ({ offset: [d] }) => {
        setCrop((oldCrop) => ({ ...oldCrop, scale: 1 + d / 50 }));
      },
      onDrag: ({ movement: [dx, dy] }) => {
        // const [dx, dy] = offset;
        setCrop((oldCrop) => ({ ...oldCrop, x: dx, y: dy }));
      },
      onDragEnd: () => {
        const newCrop = crop;
        const pdfBounds = pdfRef.current.getBoundingClientRect();
        const pdfContainerBounds = pdfContainerRef.current.getBoundingClientRect();
        // if (pdfBounds.left > pdfContainerBounds.left * numPages) {
        //   newCrop.x = 0;
        // } else if (pdfBounds.right * numPages < pdfContainerBounds.right) {
        //   newCrop.x = -(pdfBounds.width - pdfContainerBounds.width);
        // }

        // if (pdfBounds.top > pdfContainerBounds.top * numPages) {
        //   newCrop.y = 0;
        // } else if (pdfBounds.bottom * numPages < pdfContainerBounds.bottom) {
        //   newCrop.y = -(pdfBounds.height - pdfContainerBounds.height);
        // }

        setCrop(newCrop);
      },
    },
    {
      drag: { initial: () => [crop.x, crop.y] },
      pinch: { distanceBounds: { min: -30, max: 100 } },
      domTarget: pdfRef,
      eventOptions: { passive: false },
    }
  );

  const onDocumentLoadSuccess = useCallback((data) => {
    setNumPages(data.numPages);
  }, []);

  const onDocumentLoadError = useCallback((data) => {
    // console.log(data);
  }, []);

  return (
    <div className="h-full overflow-hidden">
      <div
        className={`relative overflow-hidden bg-black ring-4 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        } ring-white aspect-w-2 aspect-h-3 bg-white border-black border-2 m-4 flex items-center justify-center`}
        ref={pdfContainerRef}>
        <motion.div
          style={{
            scale: crop.scale,
            left: crop.x,
            top: crop.y,
            touchAction: "none",
            userSelect: "none",
            MozUserSelect: "none",
          }}
          ref={pdfRef}>
          <Document
            className="flex flex-col items-center w-auto h-full"
            file="https://firebasestorage.googleapis.com/v0/b/mestredeobra-be796.appspot.com/o/Meu%20novo%20projeto%2FCasa%20Suiamara%20versao%2024%20R1.pdf?alt=media&token=dc344663-1a89-4379-aae2-b0dd52e772c7"
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            error={<span>Ocorreu um erro ao carregar o arquivo</span>}
            loading={<LoadingSpinner />}>
            {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
              <div key={page} className="w-auto h-full mb-2">
                <Page scale={0.5} pageNumber={page} className="mb-2" />
                <span>{`${page}/${numPages}`}</span>
              </div>
            ))}
            {/* <div key={1} className="w-auto h-full">
              <Page
                pageNumber={1}
                className="w-auto h-full"
                height={
                  pdfContainerRef.current.getBoundingClientRect().height || 490
                }
              />
            </div> */}
          </Document>
        </motion.div>
      </div>
    </div>
  );
};

export default PDF;
