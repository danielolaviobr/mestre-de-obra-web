import LoadingSpinner from "@components/shared/LoadingSpinner";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useGesture } from "react-use-gesture";
import { GetStaticPaths, GetStaticProps } from "next";
import getFileUrl from "@functions/firestore/getFileUrl";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import ButtonSecondary from "@components/shared/ButtonSecondary";
import { useRouter } from "next/router";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// export const getStaticPaths: GetStaticPaths = async () => ({
//   paths: [
//     {
//       params: {
//         id: "test",
//       },
//     },
//   ],
//   fallback: "blocking",
// });

// export const getStaticProps: GetStaticProps = async (context) => {
//   const { id } = context.params;
//   try {
//     const url = await getFileUrl(id as string);

//     return {
//       props: {
//         url,
//       },
//     };
//   } catch (err) {
//     return {
//       props: {
//         url: "https://mag.wcoomd.org/uploads/2018/05/blank.pdf",
//       },
//     };
//   }
// };

const PDF = () => {
  const pdfRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState("");
  const [numPages, setNumPages] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });
  const router = useRouter();

  const getPdfUrl = useCallback(async (id: string) => {
    const urlData = await getFileUrl(id);
    setUrl(urlData);
  }, []);

  useGesture(
    {
      onPinch: ({ offset: [d] }) => {
        setCrop((oldCrop) => ({ ...oldCrop, scale: 1 + d / 200 }));
      },
      onDrag: ({ dragging, movement: [dx, dy] }) => {
        setIsDragging(dragging);
        setCrop((oldCrop) => ({ ...oldCrop, x: dx, y: dy }));
      },
    },
    {
      drag: {
        initial: () => [crop.x, crop.y],
        bounds: {
          top: -200 * numPages,
          bottom: 200,
          left: -100,
          right: 100,
        },
      },
      pinch: { distanceBounds: { min: -150, max: 300 } },
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

  useEffect(() => {
    const { id } = router.query;

    getPdfUrl(id as string);
  }, [router.query, getPdfUrl]);

  return (
    <div className="">
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
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            error={<span>Ocorreu um erro ao carregar o arquivo</span>}
            loading={<span>Carregando...</span>}>
            {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
              <div key={page} className="w-auto h-full mb-2">
                <Page scale={0.5} pageNumber={page} className="mb-2" />
                <span>{`${page}/${numPages}`}</span>
              </div>
            ))}
          </Document>
        </motion.div>
      </div>
      <ButtonPrimary>Download</ButtonPrimary>
      <ButtonSecondary>Centralizar</ButtonSecondary>
    </div>
  );
};

export default PDF;
