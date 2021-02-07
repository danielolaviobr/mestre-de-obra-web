import { NextApiRequest, NextApiResponse } from "next";
import app from "@firebase";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "POST") {
    response.json({ error: "This route is only accessible via POST requests" });
    return;
  }

  await app.auth().signOut();

  response.status(200).json({ message: "User loged out" });
};
