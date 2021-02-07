import { NextApiRequest, NextApiResponse } from "next";
import app from "@firebase";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "POST") {
    response.json({ error: "This route is only accessible via POST requests" });
    return;
  }

  // Data is pre-validated
  const { email, password } = request.body;

  try {
    const authData = await app
      .auth()
      .signInWithEmailAndPassword(email, password);
    response.status(200).json(authData.user);
  } catch (err) {
    throw new Error(err.code);
  }
};
