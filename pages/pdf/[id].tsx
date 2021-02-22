import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useGesture } from "react-use-gesture";
import getFileUrl from "@functions/firestore/getFileUrl";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import ButtonSecondary from "@components/shared/ButtonSecondary";
import { useRouter } from "next/router";
import { ArrowDown, Maximize } from "react-feather";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "hooks/auth";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDF = () => {
  const pdfRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState("");
  const [numPages, setNumPages] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();

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
      },
      pinch: { distanceBounds: { min: -150, max: 300 } },
      domTarget: pdfRef,
      eventOptions: { passive: false },
    }
  );

  const onDocumentLoadSuccess = useCallback((data) => {
    setNumPages(data.numPages);
  }, []);

  const onDocumentLoadError = useCallback(() => {
    toast({
      position: "top",
      title: "Erro ao carregar o PDF",
      description:
        "Ocorreu um erro ao carregar o PDF, favor tentar novamente ou entrar em contato com contato@mestredeobra.app",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }, [toast]);

  useEffect(() => {
    const { id } = router.query;

    getPdfUrl(id as string);
  }, [router.query, getPdfUrl]);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <>
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
            noData={<span>Carregando...</span>}
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
      <div className="mx-4">
        <a href={url as string} target="_blank" rel="noreferrer">
          <ButtonPrimary type="button" icon={<ArrowDown />}>
            Download
          </ButtonPrimary>
        </a>
        <ButtonSecondary
          type="button"
          icon={<Maximize />}
          onClick={() => setCrop({ x: 0, y: 0, scale: 1 })}>
          Centralizar
        </ButtonSecondary>
        {
          // TODO Add button to delete file
        }
      </div>
    </>
  );
};

export default PDF;
