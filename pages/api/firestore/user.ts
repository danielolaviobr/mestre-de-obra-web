import { NextApiRequest, NextApiResponse } from "next";
import app from "@firebase";

const db = app.firestore();

interface UserData {
  uid: string;
  email: string;
  phone: string;
  userType: string;
  projects: string[];
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "GET") {
    response
      .status(404)
      .json({ message: "This route is only accessible via GET requests" });
  }

  const { uid } = request.query;

  const userData = await db
    .collection("users")
    .doc(uid as string)
    .get();

  const data = userData.data() as UserData;

  if (!userData.data()) {
    response.status(404).json({ message: "No user found" });
  }

  response.json({ ...data });
};
