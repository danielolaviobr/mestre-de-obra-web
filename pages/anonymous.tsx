import React, { FormEvent, useCallback, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import { useAuth } from "hooks/auth";
import { useRouter } from "next/router";

const Anonymous: React.FC = () => {
  const { anonymousSignIn, user } = useAuth();
  const { push } = useRouter();

  const handleFormSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      await anonymousSignIn("991138334");
    },
    [anonymousSignIn]
  );

  useEffect(() => {
    if (user) {
      push("/dashboard");
    }
  }, [user, push]);

  return (
    <main className="flex items-center justify-center flex-1 min-h-screen min-w-screen">
      <main className="flex items-center justify-center">
        <Box
          className="flex flex-col px-4 py-6 rounded"
          bg="white"
          boxShadow="base">
          <form onSubmit={handleFormSubmit}>
            <Button colorScheme="blue" type="submit">
              Anonimo
            </Button>
          </form>
        </Box>
      </main>
    </main>
  );
};

export default Anonymous;
