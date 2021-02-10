import { Heading, useToast } from "@chakra-ui/react";
import FileCard from "@components/Dashboard/FileCard";
import { v4 as uuid } from "uuid";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import api from "services/api";
import Menu from "@components/shared/Menu";

interface File {
  name: string;
  project: string;
  url: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const { push } = useRouter();
  const toast = useToast();

  const getFilesInProject = useCallback(async () => {
    if (user.projects.length === 0) {
      return;
    }
    try {
      const response = await api.get("/firestore/filesInProjects", {
        params: { projects: user.projects },
      });

      const newFiles = [...response.data.files];
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
    }
  }, [user, toast]);

  useEffect(() => {
    if (!user) {
      push("/");
      return;
    }

    setProjects(user.projects);
    getFilesInProject();
  }, [user, push, getFilesInProject]);

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
              <div key={uuid()}>
                <Heading className="mb-4" as="h2" size="md" isTruncated>
                  {project}
                </Heading>
                {projectFiles.length === 0 && (
                  <span>Nenhum arquivo encontrado</span>
                )}
                {projectFiles.map((file) => (
                  <FileCard key={uuid()} url={file.url}>
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
