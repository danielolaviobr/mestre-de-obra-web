import React, { useCallback, useRef } from "react";
import { ArrowDown, Download, X } from "react-feather";
import {
  Box,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import deleteFile from "@functions/storage/deleteFile";
import { motion } from "framer-motion";
import { Variants } from "framer-motion/types";
import DeleteFileAlert from "../shared/DeleteFileAlert";

interface FileCardProps {
  id?: string;
  url?: string;
  project: string;
  isCreator: boolean;
  variants?: Variants;
  update(boolean): void;
}

const FileCard: React.FC<FileCardProps> = ({
  children,
  project,
  url = "file-not-found",
  variants = {},
  id = "file-not-found",
  update,
  isCreator,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const alertRef = useRef();
  const [isLargerThan750, isLargerThan1024] = useMediaQuery([
    "(min-width: 750px)",
    "(min-width: 1024px)",
  ]);

  const handleDeleteFile = useCallback(async () => {
    await deleteFile({ projectName: project, fileName: children as string });
    update(true);
  }, [children, project, update]);

  return (
    <>
      <motion.div
        variants={variants}
        className={
          isLargerThan750
            ? "relative flex max-w-4xl mb-4 min-w-250px"
            : "mb-4 min-w-250px"
        }>
        <a
          href={isLargerThan1024 ? url : `/pdf/${id}`}
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
        {isLargerThan750 && isCreator && (
          <div className="absolute right-6 top-1/4">
            <Tooltip
              hasArrow
              label="Deletar arquivo"
              bg="black"
              color="white"
              placement="top">
              <X className="cursor-pointer" onClick={onOpen} />
            </Tooltip>
          </div>
        )}
      </motion.div>
      <DeleteFileAlert
        isOpen={isOpen}
        onClose={onClose}
        action={handleDeleteFile}
        fileName={children as string}
        ref={alertRef}
      />
    </>
  );
};
export default FileCard;
