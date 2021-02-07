import app from "@firebase";
import { NextApiRequest, NextApiResponse } from "next";

global.XMLHttpRequest = require("xhr2");

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "GET") {
    response.json({ error: "This route is only accessible via GET requests" });
  }

  const { project, name } = request.query;

  let url = "";
  try {
    url = await app
      .storage()
      .ref()
      .child(`${project}/${name}`)
      .getDownloadURL();
  } catch (err) {
    // console.log(err);
  }

  response.json({ url });
};
