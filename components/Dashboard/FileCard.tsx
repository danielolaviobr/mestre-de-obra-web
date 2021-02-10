import React from "react";
import { FiDownload } from "react-icons/fi";
import { Box, Text, useMediaQuery } from "@chakra-ui/react";

interface FileCardProps {
  url: string;
}

const FileCard: React.FC<FileCardProps> = ({ children, url = "" }) => {
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  return (
    <a href={url || "file-not-found"} target="_blank" rel="noreferrer">
      <Box
        className="flex items-center max-w-4xl px-6 py-4 mb-4 min-w-250px"
        cursor="pointer"
        bg="white"
        borderRadius="base"
        boxShadow="base">
        {isLargerThan750 && <FiDownload size={16} className="mr-2" />}
        <Text isTruncated>{children}</Text>
      </Box>
    </a>
  );
};
export default FileCard;
