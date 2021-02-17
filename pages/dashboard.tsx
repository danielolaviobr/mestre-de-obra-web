import { Heading, useToast, Button } from "@chakra-ui/react";
import FileCard from "@components/Dashboard/FileCard";
import { v4 as uuid } from "uuid";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import api from "services/api";
import Menu from "@components/shared/Menu";
import FilesSkeleton from "@components/Dashboard/FilesSkeleton";
import Link from "next/link";
import getFilesInProject from "@functions/firestore/getFilesInProjects";

interface File {
  name: string;
  project: string;
  url: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [projects, setProjects] = useState<string[]>([]);
  const { push } = useRouter();
  const toast = useToast();

  const fetchFiles = useCallback(async () => {
    if (user.projects.length === 0) {
      return;
    }
    try {
      setIsLoading(true);
      const newFiles = await getFilesInProject(projects);

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
  }, [user, toast, projects]);

  useEffect(() => {
    if (!user) {
      push("/");
      return;
    }

    setProjects(user.projects);
    fetchFiles();
    if (shouldRefresh) {
      setShouldRefresh(false);
    }
  }, [user, push, fetchFiles, shouldRefresh]);

  return (
    <div className="relative flex-grow min-w-250px">
      <Menu />
      <main className="mt-16">
        <Heading as="h1" size="xl" className="ml-4">
          Projetos
        </Heading>
        <div className="flex flex-col flex-grow p-4 min-w-250px">
          {projects.map((project) => {
            const projectFiles = files.filter(
              (file) => file.project === project
            );
            return (
              <div key={uuid()} className="max-w-4xl min-w-250px">
                <Heading className="mb-4" as="h2" size="md" isTruncated>
                  {project}
                </Heading>
                {isLoading && <FilesSkeleton />}
                {projectFiles.length === 0 && !isLoading && (
                  <Link href="/upload">
                    <Button colorScheme="yellow">Fazer Upload</Button>
                  </Link>
                )}
                {!isLoading &&
                  projectFiles.map((file) => (
                    <FileCard
                      key={uuid()}
                      url={file.url}
                      project={project}
                      update={setShouldRefresh}>
                      {file.name}
                    </FileCard>
                  ))}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
