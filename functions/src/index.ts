import * as functions from "firebase-functions";
import { initializeApp, firestore } from "firebase-admin";

const app = initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    functions.logger.info(request.body);
    const fileName = request.body.name?.split("/")[1];
    const projectName = request.body.name?.split("/")[0];

    const file = {
      name: String(fileName),
      project: String(projectName),
      // updated: firestore.Timestamp.now(),
    };
    functions.logger.info(file, { structuredData: true });

    await firestore(app).collection("files").add(file);
    response.send(file);
  }
);

// export const createDocumentOnUpload = functions.storage
//   .object()
//   .onFinalize(async (fileObject: functions.storage.ObjectMetadata) => {
//     const fileName = fileObject.name?.split("/")[1];
//     const projectName = fileObject.name?.split("/")[0];

//     const file = {
//       name: String(fileName),
//       project: String(projectName),
//       updated: admin.firestore.Timestamp.now(),
//     };

//     await firestoreInstance.collection("files").add(file);
//   });
