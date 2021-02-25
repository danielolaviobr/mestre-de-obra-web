import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useGesture } from "react-use-gesture";
import getFile from "@functions/firestore/getFile";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import ButtonSecondary from "@components/shared/ButtonSecondary";
import { useRouter } from "next/router";
import { ArrowDown, Maximize, X } from "react-feather";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { useAuth } from "hooks/auth";
import deleteFile from "@functions/storage/deleteFile";
import DeleteFileAlert from "@components/shared/DeleteFileAlert";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface File {
  name: string;
  updated: Date;
  url: string;
  project: string;
}

const PDF = () => {
  const pdfRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [url, setUrl] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [file, setFile] = useState<File>({
    name: "",
    url: "",
    project: "",
    updated: new Date(),
  });
  const [numPages, setNumPages] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0, scale: 1 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const alertRef = useRef();

  const getPdfUrl = useCallback(
    async (id: string) => {
      try {
        const fileData = await getFile(id);
        if (fileData) {
          setFile(fileData);
          setUrl(fileData.url);
        }
      } catch (err) {
        toast({
          position: "top",
          title: "Erro ao buscar arquivo",
          description:
            "Ocorreu um erro ao buscar pelo arquivo selecionado, favor tentar novamente",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  const handleDeleteFile = useCallback(async () => {
    await deleteFile({
      projectName: file.project,
      fileName: file.name,
    });
  }, [file]);

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
      router.push("/login");
    } else {
      setIsAnonymous(user.isAnonymous);
    }
  }, [user, router]);

  return (
    <>
      <div
        className={`min-h-screen pt-4 overflow-y-auto ${
          isAnonymous ? " pb-1 " : " pb-14 "
        }`}
        style={{ touchAction: "auto" }}>
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
          <ButtonSecondary type="button" icon={<X />} onClick={onOpen}>
            Deletar arquivo
          </ButtonSecondary>
        </div>
      </div>
      <DeleteFileAlert
        isOpen={isOpen}
        onClose={onClose}
        action={handleDeleteFile}
        fileName={file.name}
        ref={alertRef}
      />
    </>
  );
};

export default PDF;
