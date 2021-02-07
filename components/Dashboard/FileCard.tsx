import React, { useCallback, useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { Box } from "@chakra-ui/react";
import api from "services/api";

interface FileCardProps {
  project: string;
  name: string;
  url?: string;
}

const FileCard: React.FC<FileCardProps> = ({
  children,
  name,
  project,
  url = "",
}) => (
  <a href={url || "file-not-found"} target="_blank" rel="noreferrer">
    <Box
      className="flex items-center flex-1 px-6 py-4 mb-4"
      cursor="pointer"
      bg="white"
      maxW="2xl"
      borderRadius="base"
      boxShadow="base"
      isTruncated>
      <FiDownload size={20} className="mr-4" />
      {children}
    </Box>
  </a>
);

export default FileCard;
