import { auth } from "@firebase";

export default async function resetPassword(email: string) {
  await auth.sendPasswordResetEmail(email, {
    url: `${process.env.NEXT_PUBLIC_API_URL}/anonymous`,
    handleCodeInApp: true,
  });
}
