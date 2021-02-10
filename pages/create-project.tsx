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
  const toast = useToast();
  const [fileLoading, setFileLoading] = useState(false);
  const projectNameInputRef = useRef<HTMLInputElement>();

  const submitFileForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setFileLoading(true);
      const projectName = projectNameInputRef.current.value;
      try {
        const response = await api.post("firestore/createProject", {
          project: projectName,
          uid: user.uid,
        });
        console.log(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setFileLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user === undefined) {
      push("/");
    }
  }, [user, push]);

  return (
    <main className="flex items-center justify-center flex-1 min-h-screen min-w-screen">
      <Menu />
      <main className="flex items-center justify-center m-4">
        <Box
          className="flex flex-col px-4 py-6 rounded"
          bg="white"
          boxShadow="base">
          <form onSubmit={submitFileForm}>
            <Heading as="h1" size="lg" mb={4}>
              Criar um novo projeto
            </Heading>
            <Input
              ref={projectNameInputRef}
              mb={4}
              placeholder="Nome do projeto"
            />
            <Button isLoading={fileLoading} colorScheme="blue" type="submit">
              Criar projeto
            </Button>
          </form>
        </Box>
      </main>
    </main>
  );
};

export default CreateProject;
