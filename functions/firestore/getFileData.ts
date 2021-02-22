import { firestore } from "@firebase";

interface File {
  id: string;
  name: string;
  url: string;
  project: string;
}

export default async function getFilesInProject(projectId: string) {
  const file = await firestore.collection("files").doc(projectId).get();

  const { url } = file.data() as File;

  return url;
}
