import React, { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// import { Document } from "react-pdf/dist/esm/entry.webpack";

const PDF = () => {
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [file, setFile] = useState<any>();

  const onDocumentLoadSuccess = useCallback((data) => {
    setNumPages(data.numPages);
  }, []);

  const onDocumentLoadError = useCallback((data) => {
    console.log(data);
  }, []);

  return (
    <div>
      <Document
        file="https://storage.googleapis.com/mestredeobra-be796.appspot.com/Projeto%20do%20Sub/cartao_cidadao.pdf?GoogleAccessId=mestredeobra-be796%40appspot.gserviceaccount.com&Expires=4070908800&Signature=kk00GhppQI0r3s9PmRPC7frMBqgmuT0A0e8%2BZ8OvcK2auPxqqWjQ3Q08nyQred9UjJML3Vcfu%2FSzm8bo4zsyzjLdjzNxw%2FupjLBW%2BBIKI5nOUHwYs146wq18SOwqJ%2BL3EuZ%2FimtsBJ1tMWKNpPzE6Z4%2B%2FJffYYVb68PRnaIM45%2BGkwTxRjRJ%2BxUBCwaix6knzomU214wucTllCBUrk%2FW8RAL8Ly%2BhQ5gxMKo9oT8ggrF6RK4Qtd0Uo0MfJr6BdEeY5nt4znKOkqbPps%2FbUtxSzgK2EcbdBSFq2%2FBBhQ0up3umjRkqRKRycZ5ahV%2B%2F07xqTxKCpaH3SkAXHI0NDoSSw%3D%3D"
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}>
        <Page pageNumber={page} />
      </Document>
      <p>
        Page
        {page} of
        {numPages}
      </p>
    </div>
  );
};

export default PDF;
