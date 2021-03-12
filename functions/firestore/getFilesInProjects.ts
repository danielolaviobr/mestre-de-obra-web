import { firestore, storage } from "@firebase";

interface File {
  id: string;
  name: string;
  url: string;
  project: string;
}

export default async function getFilesInProject(projectsNames: string[]) {
  try {
    const storageRef = storage.ref();
    const filesInStorage: string[] = [];
    const files: File[] = [];
    const storagePromises = projectsNames.map(async (project: string) => {
      if (project) {
        const filesInProject = await storageRef.child(project).list();
        return filesInProject.items;
      }
      return null;
    });

    const storageFilesPerProject = await Promise.all(storagePromises);

    storageFilesPerProject.forEach((project) =>
      project?.forEach((file) => filesInStorage.push(file.name))
    );

    const firestorePromises = projectsNames.map(async (project: string) => {
      if (project) {
        const filesCollection = await firestore
          .collection("files")
          .where("project", "==", project)
          .get();

        filesCollection.forEach(async (file) => {
          const fileData = file.data() as File;
          if (filesInStorage.includes(fileData.name)) {
            files.push({ ...fileData, id: file.id });
          }
        });
      }
    });

    await Promise.all(firestorePromises);

    return files;
  } catch (err) {
    console.log(err);
  }
  const fileData = {} as File;
  return [fileData];
}
