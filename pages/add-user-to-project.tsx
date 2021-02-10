import {
  Box,
  Button,
  Heading,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import Menu from "@components/shared/Menu";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import api from "services/api";

const CreateProject: React.FC = () => {
  const { user } = useAuth();
  const { push } = useRouter();
  const [projects, setProjects] = useState([]);
  const toast = useToast();
  const [fileLoading, setFileLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const userEmailInputRef = useRef<HTMLInputElement>();

  const handleProjectChange = useCallback((event) => {
    setSelectedProject(event.target.value);
  }, []);

  const submitFileForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setFileLoading(true);
      const email = userEmailInputRef.current.value;
      try {
        const response = await api.post("firestore/addUserToProject", {
          project: selectedProject,
          email,
        });
        console.log(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setFileLoading(false);
      }
    },
    [selectedProject]
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
          className="flex flex-col px-4 py-6 rounded"
          bg="white"
          boxShadow="base">
          <form onSubmit={submitFileForm}>
            <Heading as="h1" size="lg" mb={4}>
              Adicionar um membro
            </Heading>
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
            <Input
              ref={userEmailInputRef}
              mb={4}
              placeholder="E-mail do usuário"
            />
            <Button isLoading={fileLoading} colorScheme="blue" type="submit">
              Adicionar
            </Button>
          </form>
        </Box>
      </main>
    </main>
  );
};

export default CreateProject;
