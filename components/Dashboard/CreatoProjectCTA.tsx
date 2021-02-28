import React, { useCallback, useEffect, useState } from "react";
import ButtonPrimary from "@components/shared/ButtonPrimary";
import { Heading } from "@chakra-ui/react";
import { useAuth } from "hooks/auth";
import { ChevronRight } from "react-feather";
import { useRouter } from "next/router";

const CreatoProjectCTA = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleClick = useCallback(() => {
    if (isSubscribed) {
      router.push("/create-project");
    } else {
      router.push("/subscription");
    }
  }, [isSubscribed, router]);

  useEffect(() => {
    if (user) {
      setIsSubscribed(user.isSubscribed);
    }
  }, [user]);

  return (
    <div className="flex flex-col max-w-md min-w-250px">
      <Heading as="h2" size="md">
        Nenhum projeto encontrado
      </Heading>
      <span className="mt-4">
        Parece que você ainda não criou nenhum projeto. Clique no botão abaixo
        para criar seu primeiro projeto.
      </span>
      <ButtonPrimary icon={<ChevronRight />} onClick={handleClick}>
        Criar projeto
      </ButtonPrimary>
    </div>
  );
};

export default CreatoProjectCTA;
