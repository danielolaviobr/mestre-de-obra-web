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

    case "auth/phone-already-exists":
      toastMessage = {
        title: "Telefone já cadastrado",
        description: "Este telefone já está cadastrado, favor inserir outro.",
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

    case "auth/email-already-in-use":
      toastMessage = {
        title: "E-mail já cadastrado",
        description:
          "O e-mail informado já está cadastrado no Mestre de Obras.",
      };
      break;

    case "auth/too-many-requests":
      toastMessage = {
        title: "Vai mais devagar",
        description:
          "Você tentou fazer isso muitas vezes, aguarde um pouco e tente novamente.",
      };
      break;

    case "auth/authenticated-user":
      toastMessage = {
        title: "Telefone já cadastrado",
        description:
          "Este telefone já está cadastrado, favor acessar sua conta usando e-mail e senha.",
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
