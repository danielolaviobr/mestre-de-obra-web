import { NextApiRequest, NextApiResponse } from "next";
import app from "@firebase";

const db = app.firestore();

interface File {
  name: string;
  downloadUrl: string;
  project: string;
}

// TODO Fazer middleware para garantir que a requisição vem de um determinando HOST (CORS)
// TODO Fazer middleware para garantir que a requisição vem de um usuário autenticado

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "GET") {
    response.json({ error: "This route is only accessible via GET requests" });
    return;
  }

  const { "projects[]": projects } = request.query as {
    "projects[]": string[];
  };

  const files: File[] = [];

  if (!projects) {
    response.status(204).json({ files: [] });
    return;
  }

  const promises = projects.map(async (project: string) => {
    const filesCollection = await db
      .collection("files")
      .where("project", "==", project)
      .get();

    filesCollection.forEach((file) => files.push(file.data() as File));
  });

  await Promise.all(promises);

  response.status(200).json({ files });
};
