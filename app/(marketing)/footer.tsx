import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignUpButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { Languages } from "@/constants/languages";

export const Footer = () => {
  return (
    <div className="hidden h-20 w-full border-t-2 border-slate-200 p-2 lg:block">
      <div className="mx-auto flex h-full max-w-screen-lg items-center justify-evenly">
        <ClerkLoading>
          <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedOut>
            {Languages.map(({ icon, label, id }) => (
              <SignUpButton
                key={id}
                mode="modal"
                afterSignInUrl="/learn"
                afterSignUpUrl="/learn">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full cursor-default">
                  <Image
                    src={icon}
                    alt={label}
                    height={32}
                    width={40}
                    className="mr-4 rounded-md"
                  />
                  {label}
                </Button>
              </SignUpButton>
            ))}
          </SignedOut>
          <SignedIn>
            {Languages.map(({ id, label, icon }) => (
              <Button
                key={id}
                variant="ghost"
                size="lg"
                className="w-full cursor-default">
                <Image
                  src={icon}
                  alt={label}
                  height={32}
                  width={40}
                  className="mr-4 rounded-md"
                />
                {label}
              </Button>
            ))}
          </SignedIn>
        </ClerkLoaded>
      </div>
    </div>
  );
};
