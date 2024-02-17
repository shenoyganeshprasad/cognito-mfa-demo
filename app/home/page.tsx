'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { Auth } from 'aws-amplify';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-svh">
      <div className="text-6xl font-medium">Home</div>

      <Button
        onClick={async () => {
          const res = await Auth.signOut({ global: true });

          router.replace('/');
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}
