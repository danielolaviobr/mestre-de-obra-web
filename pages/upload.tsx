import {
  Box,
  Heading,
  ListItem,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import SelectInput from "@components/shared/SelectInput";
import { storage } from "@firebase";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";

const Upload: React.FC = () => {
  const { user } = useAuth();
  const { push } = useRouter();
  const toast = useToast();
  const [fileLoading, setFileLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState("");

  const handleProjectChange = useCallback((event) => {
    setSelectedProject(event.target.value);
  }, []);

  const handleFileSelection = useCallback(
    async (e) => {
      const maxFileSize = 10000000;
      const selectedFiles = e.target.files;
      const filesArray = [];
      Object.keys(selectedFiles).forEach(async (key) => {
        if (selectedFiles[key].size > maxFileSize) {
          toast({
            position: "top",
            title: `O arquivo ${selectedFiles[key].name} é grande de mais`,
            description:
              "Apenas arquivos com menos de 10mb podem ser enviados para o Mestre de Obras.",
            status: "warning",
            isClosable: true,
            duration: 3000,
          });

          return;
        }

        if (selectedFiles[key].type !== "application/pdf") {
          toast({
            position: "top",
            title: `O arquivo ${selectedFiles[key].name} não é PDF`,
            description:
              "Apenas arquivos do tipo PDF podem ser enviados para o Mestre de Obras.",
            status: "warning",
            isClosable: true,
            duration: 3000,
          });

          return;
        }

        filesArray.push(selectedFiles[key]);
      });
      setFiles(filesArray);
    },
    [toast]
  );

  const submitFileForm = useCallback(
    async (e) => {
      e.preventDefault();
      setFileLoading(true);

      try {
        if (!selectedProject) {
          throw new Error(
            "É necessário selecionar um projeto para envair os arquivos"
          );
        }

        const storageRef = storage.ref();

        const filesPromises = files.map(async (file) => {
          const fileRef = storageRef.child(`${selectedProject}/${file.name}`);
          await fileRef.put(file);
        });

        fileInputRef.current.value = "";
        await Promise.all(filesPromises);

        toast({
          position: "top",
          title: "Arquivos enviados",
          status: "success",
          isClosable: true,
          duration: 3000,
        });

        setFiles([]);
      } catch (err) {
        const description = err.message
          ? err.message
          : "Ocorreu um erro ao enviar os arquivos, favor tentar novamente.";
        toast({
          position: "top",
          title: "Erro ao enviar arquivos",
          description,
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      } finally {
        setFileLoading(false);
      }
    },
    [files, selectedProject, toast]
  );

  useEffect(() => {
    if (user === undefined) {
      push("/");
      return;
    }

    if (!user.isSubscribed) {
      toast({
        position: "top",
        title: "Pagina bloqueada",
        description: "Você não têm permissão de criar um projeto.",
        status: "warning",
        isClosable: true,
        duration: 5000,
      });
      push("/dashboard");
    }

    setProjects(user.projects);
  }, [user, push, toast]);

  return (
    <div className="flex items-center justify-center flex-1">
      <Box className="flex flex-col flex-1 max-w-2xl mx-4" bg="white">
        <form onSubmit={submitFileForm}>
          <Heading mb={4} size="xl">
            Adicionar arquivos
          </Heading>
          <SelectInput
            placeholder="Selecione o projeto"
            onChange={handleProjectChange}>
            {projects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </SelectInput>
          <label className="justify-center border-btn">
            Selecionar arquivos
            <input
              id="file-selection"
              className="hidden"
              type="file"
              onChange={handleFileSelection}
              multiple
              ref={fileInputRef}
            />
          </label>
          <ButtonPrimary isLoading={fileLoading} className="justify-center">
            Enviar arquivos
          </ButtonPrimary>
        </form>
        <UnorderedList mt={4}>
          {files.map((file) => (
            <ListItem key={file.name}>{file.name}</ListItem>
          ))}
        </UnorderedList>
      </Box>
    </div>
  );
};

export default Upload;
