import { Box, Button, Heading, Select, useToast } from "@chakra-ui/react";
import Menu from "@components/shared/Menu";
import TextInput from "@components/shared/TextInput";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiPhone } from "react-icons/fi";
import InputMask from "react-input-mask";
import addViewerToProject from "firestore/addViewerToProject";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface FormData {
  phone: string;
}

const AddViewerToProject: React.FC = () => {
  const { user } = useAuth();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const toast = useToast();

  const formRef = useRef<FormHandles>();

  const handleProjectChange = useCallback((event) => {
    setSelectedProject(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      // TODO Refactor to use Unform on select
      const form = { phone: formData.phone, projectName: selectedProject };
      try {
        await addViewerToProject(form);

        formRef.current.setData({ phone: "" });
        setSelectedProject("");
        toast({
          position: "top",
          title: "Usuário adicionado ao projeto",
          status: "success",
          isClosable: true,
          duration: 5000,
        });
      } catch (err) {
        toast({
          position: "top",
          title: "Erro ao adicionar usuário",
          description:
            "Ocorreu um erro ao adicionar o usuário, favor atualizar a página e tentar novamente.",
          status: "success",
          isClosable: true,
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [selectedProject, toast]
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
    <main className="flex items-center justify-center flex-1 min-h-screen min-w-screen">
      <Menu />
      <main className="flex items-center justify-center m">
        <Box
          className="flex flex-col px-4 py-6 rounded"
          bg="white"
          boxShadow="base">
          <Form ref={formRef} onSubmit={handleSubmit}>
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
            <TextInput
              name="phone"
              leftIcon={<FiPhone />}
              variant="outline"
              pr="4.5rem"
              type="text"
              placeholder="Telefone"
              as={InputMask}
              mask="(99) 99999-9999"
            />
            <div className="flex justify-between">
              <Button isLoading={isLoading} colorScheme="blue" type="submit">
                Adicionar
              </Button>
              <CopyToClipboard
                text={`${process.env.NEXT_PUBLIC_API_URL}/anonymous`}>
                <Button colorScheme="yellow" type="button" px="22px">
                  Copiar link
                </Button>
              </CopyToClipboard>
            </div>
          </Form>
        </Box>
      </main>
    </main>
  );
};

export default AddViewerToProject;
