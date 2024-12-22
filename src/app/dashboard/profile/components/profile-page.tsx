'use client';

import ProfileCard from '../../../../components/profile-card';
import ProfileCompletionBar from './profile-completion-bar';
import CompleteProfileForm from './complete-profile-form';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';

export default function ProfilePage() {
  const { data } = useSession();

  const user = data?.user as User;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-[1fr_2fr]">
      <ProfileCard user={user} />
      <CompleteProfileForm />
      <ProfileCompletionBar />
    </div>
  );
}
