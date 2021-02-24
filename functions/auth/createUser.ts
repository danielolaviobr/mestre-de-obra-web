import { auth, firestore } from "@firebase";

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
  const userData = await auth.createUserWithEmailAndPassword(email, password);

  await firestore.collection("users").doc(userData.user.uid).update({
    phone,
  });
}
