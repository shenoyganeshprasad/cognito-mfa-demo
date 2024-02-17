"use client";

import { useRouter } from "next/navigation";

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

export default function ChangePassword() {
  const router = useRouter();

  const { newPassword, updateNewPassword, completeNewPassword } =
    useAuthStore();

  return (
    <div className="flex items-center justify-center h-svh bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {/* New Password */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="password">New Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={newPassword}
                  onChange={({ target }) => {
                    updateNewPassword(target.value);
                  }}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={async () => {
              console.log(newPassword);
              const res = await completeNewPassword();

              if (res === "smsMfa") {
                router.replace("/smsmfa");
              }

              if (res === "home") {
                router.replace("/home");
              }
            }}
          >
            Update
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
