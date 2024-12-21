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

const languages = [
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "hr", label: "Croatia" },
  { code: "it", label: "Italian" },
  { code: "jp", label: "Japanese" },
];

export const Footer = () => {
  return (
    <div className="hidden h-20 w-full border-t-2 border-slate-200 p-2 lg:block">
      <div className="mx-auto flex h-full max-w-screen-lg items-center justify-evenly">
        <ClerkLoading>
          <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedOut>
            {languages.map(({ code, label }) => (
              <SignUpButton
                key={code}
                mode="modal"
                afterSignInUrl="/learn"
                afterSignUpUrl="/learn">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full cursor-default">
                  <Image
                    src={`/${code}.svg`}
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
            {languages.map(({ code, label }) => (
              <Button
                key={code}
                variant="ghost"
                size="lg"
                className="w-full cursor-default">
                <Image
                  src={`/${code}.svg`}
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
