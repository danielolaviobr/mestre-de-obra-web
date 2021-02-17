import { firestore } from "@firebase";

interface AddViewerToProjectProps {
  phone: string;
  projectName: string;
}

export default async function addViewerToProject({
  phone,
  projectName,
}: AddViewerToProjectProps): Promise<void> {
  const projectsData = await firestore
    .collection("projects")
    .where("name", "==", projectName)
    .get();

  if (projectsData.empty) {
    throw new Error();
  }

  const project = projectsData.docs.map((p) => p)[0];

  const { id } = project;

  const projectViewers = project.data().viewers as Array<string>;

  projectViewers.push(phone);

  const viewers = [...new Set(projectViewers)];
  const numberOfViewers = project.data().numberOfViewers + 1;

  await firestore.collection("projects").doc(id).update({
    viewers,
    numberOfViewers,
  });
}
