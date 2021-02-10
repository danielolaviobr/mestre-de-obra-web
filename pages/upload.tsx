import {
  Box,
  Button,
  Heading,
  ListItem,
  Select,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import Menu from "@components/shared/Menu";
import app from "@firebase";
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

  const handleFileSelection = useCallback(async (e) => {
    const selectedFiles = e.target.files;
    const filesArray = [];
    Object.keys(selectedFiles).forEach(async (key) => {
      filesArray.push(selectedFiles[key]);
    });
    setFiles(filesArray);
  }, []);

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

        const storageRef = app.storage().ref();

        const filesPromises = files.map(async (file) => {
          const fileRef = storageRef.child(`${selectedProject}/${file.name}`);
          await fileRef.put(file);
        });

        fileInputRef.current.value = "";
        await Promise.all(filesPromises);

        toast({
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

    setProjects(user.projects);
  }, [user, push]);

  return (
    <main className="flex items-center justify-center flex-1 min-h-screen min-w-screen">
      <Menu />
      <main className="flex items-center justify-center m">
        <Box
          className="flex flex-col px-4 py-6 mx-2 rounded"
          bg="white"
          boxShadow="base">
          <form onSubmit={submitFileForm}>
            <Heading mb={4}>Adicionar arquivos</Heading>
            <Select
              mb={4}
              placeholder="Selecion o projeto"
              variant="filled"
              onChange={handleProjectChange}>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </Select>
            <label
              htmlFor="file-selection"
              className="px-4 py-3 mr-4 font-semibold text-black transition duration-300 ease-in-out bg-yellow-400 rounded-md cursor-pointer hover:bg-yellow-500">
              Selecionar arquivos
            </label>
            <input
              id="file-selection"
              className="hidden"
              type="file"
              onChange={handleFileSelection}
              multiple
              ref={fileInputRef}
            />
            <Button isLoading={fileLoading} colorScheme="blue" type="submit">
              Upload File
            </Button>
          </form>
          <UnorderedList mt={4}>
            {files.map((file) => (
              <ListItem key={file.name}>{file.name}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      </main>
    </main>
  );
};

export default Upload;
