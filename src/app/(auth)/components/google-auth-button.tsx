'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '../../../components/ui/button';
import Image from 'next/image';

export default function GoogleSignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        signIn('google', { callbackUrl: callbackUrl ?? '/dashboard' })
      }
    >
      <Image src="/icons/google.svg" alt="Google Logo" width={16} height={16} />
      Авторизуватись з Google
    </Button>
  );
}
