import { firestore } from "@firebase";

interface File {
  name: string;
  updated: Date;
  url: string;
  project: string;
}

export default async function getFile(projectId: string) {
  const file = await firestore.collection("files").doc(projectId).get();

  const fileData = file.data() as File;

  return fileData;
}
