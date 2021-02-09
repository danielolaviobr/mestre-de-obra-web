import React, { useCallback, useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { Box, Text } from "@chakra-ui/react";

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
      className="flex items-center px-6 py-4 mb-4 min-w-250px"
      cursor="pointer"
      bg="white"
      borderRadius="base"
      boxShadow="base">
      <FiDownload size={16} className="mr-2" />
      <Text isTruncated>{children}</Text>
    </Box>
  </a>
);

export default FileCard;
