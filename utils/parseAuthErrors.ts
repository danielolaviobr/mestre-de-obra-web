interface ToastMessage {
  title: string;
  description: string;
}

export default function parseAuthErrors(error: string): ToastMessage {
  let toastMessage: ToastMessage;
  switch (error) {
    case "auth/email-already-exists":
      toastMessage = {
        title: "E-mail já cadastrado",
        description: "Este e-mail já está cadastrado, favor inserir outro.",
      };
      break;

    case "auth/user-not-found":
      toastMessage = {
        title: "E-mail invalido",
        description:
          "Este e-mail não foi encontrado, favor verificar e tentar novamente.",
      };
      break;

    case "auth/wrong-password":
      toastMessage = {
        title: "Senha invalida",
        description:
          "A senha informada é invalida, favor verificar e tentar novamente.",
      };
      break;
    case "auth/too-many-requests":
      toastMessage = {
        title: "Vai mais devagar",
        description:
          "Você tentou fazer isso muitas vezes, aguarde um pouco e tente novamente.",
      };
      break;

    default:
      toastMessage = {
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado, favor tentar novamente.",
      };
      break;
  }

  return toastMessage;
}
