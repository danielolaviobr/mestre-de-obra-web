import { firestore } from "@firebase";

interface File {
  id: string;
  name: string;
  url: string;
  project: string;
}

export default async function getFileUrl(projectId: string) {
  const file = await firestore.collection("files").doc(projectId).get();

  const fileObject = file.data() as File;

  const url = fileObject?.url;

  return url;
}
