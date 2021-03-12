import { Box, Heading, useDisclosure, useToast } from "@chakra-ui/react";
import TextInput from "@components/shared/TextInput";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Phone } from "react-feather";
import * as Yup from "yup";

import InputMask from "react-input-mask";
import addViewerToProject from "@functions/firestore/addViewerToProject";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import ButtonSecondary from "@components/shared/ButtonSecondary";
import SelectInput from "@components/shared/SelectInput";
import ShareModal from "@components/shared/ShareModal";
import getValidationErrors from "utils/getValidationErrors";

interface FormData {
  phone: string;
}

interface Project {
  name: string;
  isCreator: boolean;
}

const AddViewerToProject: React.FC = () => {
  const { user } = useAuth();
  const { push } = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const toast = useToast();

  const formRef = useRef<FormHandles>();

  const handleProjectChange = useCallback((event) => {
    setSelectedProject(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      // TODO Refactor to use Unform on select
      setIsLoading(true);

      const form = { phone: formData.phone, projectName: selectedProject };
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          phone: Yup.string()
            .required("O telefone é obrigatório")
            .min(15, "O telefone deve ser um número válido")
            .notOneOf(
              [user?.phone || ""],
              "Não é possível adicionar a si mesmo"
            ),
        });

        await schema.validate(formData, { abortEarly: false });

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
        if (err instanceof Yup.ValidationError) {
          const validationErrors = getValidationErrors(err);
          formRef.current?.setErrors(validationErrors);
          return;
        }
        // TODO Tratar errors
        toast({
          position: "top",
          title: "Erro ao adicionar usuário",
          description:
            "Ocorreu um erro ao adicionar o usuário, favor atualizar a página e tentar novamente.",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [selectedProject, toast, user]
  );

  useEffect(() => {
    if (!user) {
      push("/login");
      toast({
        position: "top",
        title: "Usuário não autenticado",
        description:
          "Você não têm permissão de acessar essa pagina, faça o seu login para poder visualizar.",
        status: "warning",
        isClosable: true,
        duration: 5000,
      });
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
    <>
      <div className="flex items-center justify-center flex-1 flex-grow min-h-screen">
        <Box className="flex flex-col flex-1 max-w-2xl mx-4" bg="white">
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Heading as="h1" size="xl" mb={4}>
              Adicionar um membro
            </Heading>
            <SelectInput
              placeholder="Selecione o projeto"
              onChange={handleProjectChange}>
              {projects
                .filter((project) => project.isCreator === true)
                .map((project) => (
                  <option key={project.name} value={project.name}>
                    {project.name}
                  </option>
                ))}
            </SelectInput>
            <TextInput
              name="phone"
              leftIcon={<Phone size={20} strokeWidth="1.7" />}
              variant="outline"
              pr="4.5rem"
              type="text"
              placeholder="Telefone"
              as={InputMask}
              mask="(99) 99999-9999"
            />
            <div className="flex justify-between">
              <ButtonSecondary
                type="button"
                onClick={onOpen}
                className="justify-center mr-4">
                Convidar
              </ButtonSecondary>
              <ButtonPrimary
                className="justify-center ml-4"
                isLoading={isLoading}>
                Adicionar
              </ButtonPrimary>
            </div>
          </Form>
        </Box>
      </div>
      <ShareModal onClose={onClose} isOpen={isOpen} />
    </>
  );
};

export default AddViewerToProject;
