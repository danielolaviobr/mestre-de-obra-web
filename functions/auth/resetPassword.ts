import { auth } from "@firebase";

export default async function resetPassword(email: string) {
  await auth.sendPasswordResetEmail(email);
}
