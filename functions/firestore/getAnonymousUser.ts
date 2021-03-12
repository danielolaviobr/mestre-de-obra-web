import { firestore } from "@firebase";
import AppError from "utils/AppError";

interface User {
  email: string;
  name: string;
  uid: string;
  projects: Array<{ name: string; isCreator: boolean }>;
  stripeId: string;
  stripeLink: string;
  isSubscribed: boolean;
  phone: string;
  isAnonymous: boolean;
}

export default async function getAnonymousUser(phone: string) {
  const existingAuthenticatedUser = await firestore
    .collection("users")
    .where("phone", "==", phone)
    .get();

  if (!existingAuthenticatedUser.empty) {
    throw new AppError("auth/authenticated-user");
  }

  const projectsData = await firestore
    .collection("projects")
    .where("viewers", "array-contains", phone)
    .get();

  // if (projectsData.empty) {
  //   throw new AppError("project/project");
  // }

  const projectsObjects = projectsData.docs.map((project) => project.data());

  const projects = projectsObjects.map((project) => ({
    name: project.name,
    isCreator: false,
  }));

  const user: User = {
    email: "anonymous@mail.com",
    name: "anonymous",
    projects,
    isAnonymous: true,
    phone,
    uid: "anonymous",
    isSubscribed: false,
    stripeId: "",
    stripeLink: "",
  };

  return user;
}
