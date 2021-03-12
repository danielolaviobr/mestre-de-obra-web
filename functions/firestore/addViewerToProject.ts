import { firestore } from "@firebase";
import AppError from "utils/AppError";

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
    throw new AppError("project/project-not-found");
  }

  const project = projectsData.docs.map((p) => p)[0];

  if (project.data().numberOfViewers > 5) {
    throw new AppError("project/max-number-viewers");
  }

  const { id } = project;

  const projectViewers = project.data().viewers as Array<string>;

  projectViewers.push(phone);

  const viewers = [...new Set(projectViewers)];
  const numberOfViewers = viewers.length;

  await firestore.collection("projects").doc(id).update({
    viewers,
    numberOfViewers,
  });

  const user = await firestore
    .collection("users")
    .where("phone", "==", phone)
    .get();

  if (!user.empty) {
    user.forEach((doc) => {
      const userData = doc.data();
      doc.ref.update({
        projects: [
          ...userData.projects,
          { name: projectName, isCreator: false },
        ],
      });
    });
  }
}
