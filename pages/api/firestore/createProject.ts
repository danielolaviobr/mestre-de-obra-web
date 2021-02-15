import { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@firebase";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "POST") {
    response.json({ error: "This route is only accessible via POST requests" });
    return;
  }

  const { project, uid } = request.body;

  console.log(1);
  if (!project) {
    response.status(400).json({ message: "no-project-name" });
    return;
  }
  console.log(2);

  const userProjects = await firestore.collection("users").doc(uid).get();

  if (userProjects.data().createdProject === true) {
    response.status(406).json({ message: "multiple-projects" });
    return;
  }
  console.log(3);
  s;
  const existingProjects = await firestore
    .collection("projects")
    .where("name", "==", project)
    .get();

  console.log(4);
  if (!existingProjects.empty) {
    response.status(406).json({ message: "project-exists" });
    return;
  }

  await firestore
    .collection("projects")
    .add({ name: project, numberOfMemebers: 1 });

  await firestore
    .collection("users")
    .doc(uid)
    .update({ projects: [project], createdProject: true });

  response.status(200).json({ message: "Project created" });
};
