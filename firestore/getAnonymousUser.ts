import { firestore } from "@firebase";

interface User {
  email: string;
  name: string;
  uid: string;
  projects: string[];
  stripeId: string;
  stripeLink: string;
  isSubscribed: boolean;
  phone: string;
  isAnonymous: boolean;
}

export default async function getAnonymousUser(phone: string) {
  const projectsData = await firestore
    .collection("projects")
    .where("viewers", "array-contains", phone)
    .get();

  if (projectsData.empty) {
    return undefined;
  }

  const projectsObjects = projectsData.docs.map((project) => project.data());

  const projects: string[] = projectsObjects.map((project) => project.name);

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
