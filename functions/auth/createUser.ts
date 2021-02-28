import { auth, firestore } from "@firebase";
import AppError from "utils/AppError";

interface CreateUserProps {
  password: string;
  email: string;
  phone: string;
}

export default async function createUser({
  password,
  email,
  phone,
}: CreateUserProps) {
  const user = await firestore
    .collection("users")
    .where("phone", "==", phone)
    .get();

  if (!user.empty) {
    throw new AppError("auth/phone-already-exists");
  }

  const userData = await auth.createUserWithEmailAndPassword(email, password);

  await firestore.collection("users").doc(userData.user.uid).update({
    phone,
  });
}
