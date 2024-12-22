'use client';
import { PropsWithChildren, useEffect } from 'react';
import { api } from './trpc/client';
import { useSession } from 'next-auth/react';

const AuthProvider = ({ children }: PropsWithChildren) => {
  const session = useSession();
  const { data } = api.auth.getUserRole.useQuery(
    session.data?.user?.id as string
  );

  const updateUserRole = async (role: string) => {
    await session.update({ user: { ...session.data?.user, role } });
  };

  useEffect(() => {
    if (session.data?.user && data) {
      updateUserRole(data);
    }
  }, [data]);

  return <>{children}</>;
};

export default AuthProvider;
