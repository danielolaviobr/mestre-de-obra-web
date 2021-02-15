import React from "react";
import { FiDownload } from "react-icons/fi";
import { Box, Text, useMediaQuery } from "@chakra-ui/react";

interface FileCardProps {
  url?: string;
}

const FileCard: React.FC<FileCardProps> = ({
  children,
  url = "file-not-found",
}) => {
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="max-w-4xl min-w-250px">
      <Box
        cursor="pointer"
        bg="white"
        borderRadius="base"
        boxShadow="base"
        className="flex items-center max-w-4xl px-6 py-4 mb-4 min-w-250px">
        {isLargerThan750 && <FiDownload size={16} className="mr-2" />}
        <Text isTruncated>{children}</Text>
      </Box>
    </a>
  );
};
export default FileCard;
