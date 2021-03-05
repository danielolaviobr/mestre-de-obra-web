import { firestore } from "@firebase";

interface User {
  email: string;
  name: string;
  uid: string;
  projects: Array<{ name: string; isCreator: boolean }>;
  stripeId: string;
  stripeLink: string;
  isSubscribed: boolean;
  phone: string;
  isAnonymous: boolean;
}

export default async function getUser(uid: string) {
  const userData = await firestore.collection("users").doc(uid).get();

  const userSubscription = await firestore
    .collection("users")
    .doc(uid)
    .collection("subscriptions")
    .where("status", "==", "active")
    .get();

  if (!userData.exists) {
    return undefined;
  }

  const {
    email,
    name,
    uid: userId,
    projects,
    phone,
    stripeId,
    stripeLink,
  } = userData.data();

  let allUserProjects = projects;

  if (phone) {
    const viewerProjects = await firestore
      .collection("projects")
      .where("viewers", "array-contains", phone)
      .get();

    if (!viewerProjects.empty) {
      const viewerProjectsData = viewerProjects.docs.map((proj) => ({
        name: proj.data().name,
        isCreator: false,
      }));

      allUserProjects = [...projects, ...viewerProjectsData];
    }
  }

  const user: User = {
    email,
    name,
    uid: userId,
    projects: allUserProjects,
    phone,
    stripeId,
    stripeLink,
    isSubscribed: !userSubscription.empty,
    isAnonymous: false,
  };

  return user;
}
