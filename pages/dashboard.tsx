import { Heading, useToast } from "@chakra-ui/react";
import FileCard from "@components/Dashboard/FileCard";
import { v4 as uuid } from "uuid";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import FilesSkeleton from "@components/Dashboard/FilesSkeleton";
import Link from "next/link";
import getFilesInProject from "@functions/firestore/getFilesInProjects";
import { AnimatePresence, motion } from "framer-motion";
import ButtonSecondary from "@components/shared/ButtonSecondary";
import { ArrowUp } from "react-feather";

interface File {
  id: string;
  name: string;
  project: string;
  url: string;
}

interface Project {
  name: string;
  isCreator: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const listItem = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0 },
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const { push } = useRouter();
  const toast = useToast();

  const fetchFiles = useCallback(async () => {
    if (projects.length === 0) {
      return;
    }
    try {
      setIsLoading(true);
      const newFiles = await getFilesInProject(
        projects.map((project) => project.name)
      );

      setFiles(newFiles);
    } catch (err) {
      toast({
        position: "top",
        title: "Erro ao buscar projetos",
        description:
          "Ocorreu um erro ao buscar pelos seus projetos, tente atualizar a página.",
        status: "error",
        isClosable: true,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, projects]);

  useEffect(() => {
    if (!user) {
      push("/login");
      return;
    }

    setProjects(user.projects);
  }, [user, push]);

  useEffect(() => {
    fetchFiles();
    if (shouldUpdate) {
      setShouldUpdate(false);
    }
  }, [user, fetchFiles, shouldUpdate]);

  return (
    <main className="relative flex-grow pt-8 min-w-250px standalone:pt-4">
      <Heading as="h1" size="xl" className="ml-4">
        Projetos
      </Heading>
      <div className="flex flex-col flex-grow p-4 min-w-250px">
        {projects.map((project) => {
          const projectFiles = files.filter(
            (file) => file.project === project.name
          );
          return (
            <div key={uuid()} className="max-w-4xl min-w-250px">
              <Heading className="mb-4" as="h2" size="lg" isTruncated>
                {project.name}
              </Heading>
              {isLoading && <FilesSkeleton />}
              {!isLoading && projectFiles.length === 0 && (
                <Link href="/upload">
                  <ButtonSecondary icon={<ArrowUp />} type="button">
                    Fazer Upload
                  </ButtonSecondary>
                </Link>
              )}
              <AnimatePresence>
                {!isLoading && (
                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show">
                    {projectFiles
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((file) => (
                        <FileCard
                          url={file.url}
                          key={file.id}
                          id={file.id}
                          project={project.name}
                          isCreator={project.isCreator}
                          variants={listItem}
                          update={setShouldUpdate}>
                          {file.name}
                        </FileCard>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Dashboard;
