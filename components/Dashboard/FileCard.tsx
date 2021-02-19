import React, { useCallback } from "react";
import { ArrowDown, Download, X } from "react-feather";
import {
  Box,
  IconButton,
  Text,
  Tooltip,
  useMediaQuery,
} from "@chakra-ui/react";
import deleteFile from "@functions/storage/deleteFile";
import { motion } from "framer-motion";
import { Variants } from "framer-motion/types";

interface FileCardProps {
  url?: string;
  project: string;
  variants?: Variants;
  update(boolean): void;
}

const FileCard: React.FC<FileCardProps> = ({
  children,
  project,
  variants = {},
  url = "file-not-found",
  update,
}) => {
  const [isLargerThan750] = useMediaQuery("(min-width: 750px)");
  const handleDeleteFile = useCallback(async () => {
    await deleteFile({ projectName: project, fileName: children as string });
    update(true);
  }, [children, project, update]);
  return (
    <motion.div
      variants={variants}
      className={
        isLargerThan750
          ? "relative flex max-w-4xl mb-4 min-w-250px"
          : "mb-4 min-w-250px"
      }>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="flex-1 max-w-4xl mb-4 min-w-250px">
        <Box
          cursor="pointer"
          bg="white"
          borderRadius="base"
          className="flex items-center max-w-4xl px-6 py-4 border-2 border-black min-w-250px hover:bg-gray-100">
          {isLargerThan750 && <ArrowDown size={16} className="mr-2" />}
          <Text isTruncated fontWeight="500">
            {children}
          </Text>
        </Box>
      </a>
      {isLargerThan750 && (
        <div className="absolute right-6 top-3">
          <Tooltip
            hasArrow
            label="Deletar arquivo"
            bg="red.300"
            color="black"
            placement="top">
            <IconButton
              className="z-10"
              size="28px"
              variant="outline"
              colorScheme="red"
              ml="auto"
              aria-label="Deletar arquivo"
              icon={<X />}
              onClick={handleDeleteFile}
            />
          </Tooltip>
        </div>
      )}
    </motion.div>
  );
};
export default FileCard;
