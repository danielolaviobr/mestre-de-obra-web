import { Box, Heading, useToast } from "@chakra-ui/react";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import TextInput from "@components/shared/TextInput";
import createProject from "@functions/firestore/createProject";
import { Form } from "@unform/web";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Folder } from "react-feather";

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
        await createProject({
          projectName,
          uid: user.uid,
        });

        toast({
          position: "top",
          title: "Projeto criado com sucesso",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
      } catch (err) {
        let description: string;

        switch (err.message) {
          case "no-project-name":
            description = "É necessário dar um nome ao projeto.";
            break;
          case "projects-creation-limit":
            description = "O número máximo de projetos criados foi atingido.";
            break;
          case "project-exists":
            description =
              "Este nome de projeto já está em uso, tente um outro.";
            break;
          default:
            description = "Ocorreu um erro inesperado, favor tentar novamente";
            break;
        }

        toast({
          position: "top",
          title: "Erro ao criar projeto",
          description,
          status: "error",
          isClosable: true,
          duration: 3000,
        });
      } finally {
        setFileLoading(false);
      }
    },
    [user, toast]
  );

  useEffect(() => {
    if (user === undefined) {
      push("/");
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
  }, [user, push, toast]);

  return (
    <div className="flex items-center justify-center flex-1 min-h-screen min-w-screen">
      <Box className="flex flex-col flex-1 mx-4">
        <Form onSubmit={submitFileForm}>
          <Heading as="h1" size="xl" mb={4}>
            Criar um novo projeto
          </Heading>
          <TextInput
            leftIcon={<Folder size={20} strokeWidth="1.7" />}
            name="project"
            ref={projectNameInputRef}
            placeholder="Nome do projeto"
          />
          <ButtonPrimary className="justify-center" isLoading={fileLoading}>
            Criar projeto
          </ButtonPrimary>
        </Form>
      </Box>
    </div>
  );
};

export default CreateProject;
