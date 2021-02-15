import { firestore } from "@firebase";

interface CreateProjectProps {
  projectName: string;
  uid: string;
}

export default async function createProject({
  projectName,
  uid,
}: CreateProjectProps): Promise<void> {
  if (!projectName) {
    throw new Error("no-project-name");
  }

  const userData = await firestore.collection("users").doc(uid).get();
  const userProjects: string[] = userData.data().projects;
  const userCreatedProjectsAmount: number =
    userData.data().createdProjectsAmount !== undefined &&
    !Number.isNaN(Number(userData.data().createdProjectsAmount))
      ? Number(userData.data().createdProjectsAmount)
      : 0;

  if (userCreatedProjectsAmount >= 3) {
    throw new Error("projects-creation-limit");
  }

  const existingProjects = await firestore
    .collection("projects")
    .where("name", "==", projectName)
    .get();

  if (!existingProjects.empty) {
    throw new Error("project-exists");
  }

  await firestore
    .collection("projects")
    .add({ name: projectName, numberOfViewers: 1 });

  await firestore
    .collection("users")
    .doc(uid)
    .update({
      projects: [...userProjects, projectName],
      createdProjectsAmount: userCreatedProjectsAmount + 1,
    });
}
