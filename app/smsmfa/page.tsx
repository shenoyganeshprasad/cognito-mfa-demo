'use client';

import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import useAuthStore from '@/store/auth-store';

export default function SMSMFA() {
  const router = useRouter();

  const { smsCode, updateSmsCode, completeSmsMfa } = useAuthStore();
  return (
    <div className="flex items-center justify-center h-svh bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Verify Code</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {/* Code */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="password">Code</Label>
                <Input
                  type="text"
                  id="code"
                  placeholder="6 digit code"
                  value={smsCode}
                  onChange={({ target }) => {
                    updateSmsCode(target.value);
                  }}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={async () => {
              console.log(smsCode);
              const res = await completeSmsMfa();

              if (res === 'loggedUser') {
                router.replace('/home');
              }
            }}
          >
            Verify
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
