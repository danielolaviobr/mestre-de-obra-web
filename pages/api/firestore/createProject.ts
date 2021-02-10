import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@firebase";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "POST") {
    response.json({ error: "This route is only accessible via POST requests" });
    return;
  }

  const { project, uid } = request.body;

  if (!project) {
    response.status(400).json({ message: "No project provided" });
    return;
  }

  const userProjects = await firestore.collection("users").doc(uid).get();

  if (userProjects.data().projects.length !== 0) {
    response.status(406).json({ message: "Users can only have on project" });
    return;
  }

  const existingProjects = await firestore
    .collection("projects")
    .where("name", "==", project)
    .get();

  if (!existingProjects.empty) {
    response.status(406).json({ message: "Project already exists" });
    return;
  }

  await firestore
    .collection("projects")
    .add({ name: project, numberOfMemebers: 1 });

  await firestore
    .collection("users")
    .doc(uid)
    .update({ projects: [project] });

  response.status(200).json({ message: "Project created" });
};
