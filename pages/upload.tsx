import { Box, Button, Input, Select } from "@chakra-ui/react";
import Menu from "@components/shared/Menu";
import app from "@firebase";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";

const Upload: React.FC = () => {
  const { user } = useAuth();
  const { push } = useRouter();
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
    const filesNames = [];
    Object.keys(selectedFiles).forEach(async (key) => {
      filesArray.push(selectedFiles[key]);
      filesNames.push(selectedFiles[key].name);
    });
    setFiles(filesArray);
  }, []);

  const submitFileForm = useCallback(
    async (e) => {
      e.preventDefault();
      setFileLoading(true);
      const storageRef = app.storage().ref();
      const filesPromises = files.map(async (file) => {
        const fileRef = storageRef.child(`${selectedProject}/${file.name}`);
        await fileRef.put(file);
      });
      fileInputRef.current.value = "";
      await Promise.all(filesPromises);
      setFileLoading(false);
    },
    [files, selectedProject]
  );

  useEffect(() => {
    if (user === undefined) {
      push("/");
      return;
    }

    setProjects(user.projects);
  }, [user, push]);

  return (
    <main className="flex flex-1 min-h-screen bg-blue-100 min-w-screen">
      <Menu />
      <main className="flex items-center justify-center m">
        <Box
          className="flex flex-col px-4 py-6 rounded"
          bg="white"
          boxShadow="base">
          <form onSubmit={submitFileForm}>
            <Select
              placeholder="Selecion o projeto"
              variant="filled"
              onChange={handleProjectChange}>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </Select>
            <label>
              <input
                className="hidden"
                type="file"
                onChange={handleFileSelection}
                multiple
                ref={fileInputRef}
              />
            </label>
            <Button isLoading={fileLoading} colorScheme="blue" type="submit">
              Upload File
            </Button>
          </form>
        </Box>
      </main>
    </main>
  );
};

export default Upload;
