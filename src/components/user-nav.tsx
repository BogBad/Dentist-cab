'use client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { data } from '../constants/nav';
import UserDropdown from './user-dropdown';
import { useSession } from 'next-auth/react';
import { UserRound } from 'lucide-react';
import * as React from 'react';

export function UserNav() {
  const session = useSession();
  const user = session?.data?.user;

  if (!user || !user.email) return null;

  const fallback = user.email[0].toUpperCase();

  return (
    <UserDropdown>
      <div className="flex cursor-pointer items-center gap-2 px-0.5 py-0.5 text-left text-sm">
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage src={user.image as string} alt={user.name || 'avatar'} />
          <AvatarFallback>
            <UserRound
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
          </AvatarFallback>
        </Avatar>
      </div>
    </UserDropdown>
  );
}
