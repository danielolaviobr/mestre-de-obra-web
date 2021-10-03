import React, { useCallback } from "react";
import { ArrowDown, X } from "react-feather";
import {
  Box,
  Text,
  Tooltip,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import deleteFile from "@functions/storage/deleteFile";
import { motion } from "framer-motion";
import { Variants } from "framer-motion/types";
import Link from "next/link";
import DeleteFileAlert from "../shared/DeleteFileAlert";

interface FileCardProps {
  id?: string;
  url?: string;
  project: string;
  isCreator: boolean;
  variants?: Variants;
  update(value: boolean): void;
  index: number;
}

const FileCard: React.FC<FileCardProps> = ({
  children,
  project,
  url = "file-not-found",
  variants = {},
  id = "file-not-found",
  update,
  isCreator,
  index,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
            ? "relative flex max-w-4xl mb-4 md:mb-0 md:min-w-full"
            : "mb-4 min-w-72"
        }>
        <div className="flex-1 max-w-4xl mb-4 md:mb-2 min-w-72 md:min-w-full">
          <Box
            cursor="pointer"
            bg={{ base: "white", md: index % 2 === 0 ? "gray.100" : "gray.50" }}
            borderRadius="base"
            className="flex items-center justify-between max-w-4xl px-6 py-4 transition duration-200 border-2 border-black md:border-none md:max-w-full min-w-72 hover:bg-gray-200 md:py-2">
            <Link href={isLargerThan1024 ? url : `/pdf/${id}`}>
              <a className="flex items-center">
                {isLargerThan750 && <ArrowDown size={16} className="mr-2" />}
                <Text
                  isTruncated
                  fontWeight="500"
                  className="max-w-2xs md:max-w-none hover:underline">
                  {children}
                </Text>
              </a>
            </Link>
            {isLargerThan750 && isCreator && (
              <div className="z-10">
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
          </Box>
        </div>
      </motion.div>
      <DeleteFileAlert
        isOpen={isOpen}
        onClose={onClose}
        action={handleDeleteFile}
        fileName={children as string}
      />
    </>
  );
};
export default FileCard;
