import { auth } from "@firebase";

interface ChangePasswordProps {
  password: string;
  code: string;
}

export default async function changePassword({
  password,
  code,
}: ChangePasswordProps) {
  await auth.confirmPasswordReset(code, password);
}
