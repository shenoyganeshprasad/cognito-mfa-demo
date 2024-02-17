"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// Amplify
import { Amplify, Auth } from "aws-amplify";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Store
import useAuthStore from "@/store/auth-store";

export default function SignIn() {
  const router = useRouter();

  const { signInForm, updateSignInForm, signIn } = useAuthStore();

  useEffect(() => {
    Amplify.configure({
      Auth: {
        userPoolId: "{USERPOOL ID}", // replace with your userpool
        userPoolWebClientId: "{APP CLIENT ID}", // replace with your app client id
        region: "{REGION}", // replace with your region
        mandatorySignIn: true,
        authenticationFlowType: "USER_SRP_AUTH",
      },
    });

    Auth.configure();
  }, []);

  return (
    <div className="flex items-center justify-center h-svh bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {/* Username */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={signInForm.username}
                  onChange={({ target }) => {
                    updateSignInForm("username", target.value);
                  }}
                />
              </div>

              {/* Password */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={signInForm.password}
                  onChange={({ target }) => {
                    updateSignInForm("password", target.value);
                  }}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={async () => {
              console.log(signInForm);
              const res = await signIn();
              if (res === "changePassword") {
                router.replace("/changepassword");
              }

              if (res === "smsMfa") {
                router.replace("/smsmfa");
              }

              if (res === "home") {
                router.replace("/home");
              }
            }}
          >
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
