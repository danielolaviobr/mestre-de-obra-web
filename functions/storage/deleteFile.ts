import { storage } from "@firebase";

interface DeleteFilesProps {
  projectName: string;
  fileName: string;
}

export default async function deleteFile({
  projectName,
  fileName,
}: DeleteFilesProps): Promise<void> {
  const storageRef = storage.ref();
  const fileRef = storageRef.child(`${projectName}/${fileName}`);

  await fileRef.delete();
}
