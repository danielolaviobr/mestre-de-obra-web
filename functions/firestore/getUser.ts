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
    stripeId,
    stripeLink,
  } = userData.data();

  const user: User = {
    email,
    name,
    uid: userId,
    projects,
    phone,
    stripeId,
    stripeLink,
    isSubscribed: !userSubscription.empty,
    isAnonymous: false,
  };

  return user;
}
