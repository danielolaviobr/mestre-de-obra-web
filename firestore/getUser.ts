import { firestore } from "@firebase";

export const firestoreS = "";

interface User {
  email: string;
  name: string;
  uid: string;
  projects: string[];
  phone: string;
  type: string;
  stripeId: string;
  stripeLink: string;
  isSubscribed: boolean;
}

export default async function getUser(uid: string) {
  const userData = await firestore
    .collection("users")
    .doc(uid as string)
    .get();

  const userSubscription = await firestore
    .collection("users")
    .doc(uid as string)
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
    type,
    stripeId,
    stripeLink,
  } = userData.data();

  const user: User = {
    email,
    name,
    uid: userId,
    projects,
    phone,
    type,
    stripeId,
    stripeLink,
    isSubscribed: !userSubscription.empty,
  };

  return user;
}
