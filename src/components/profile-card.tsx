import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { CalendarFold, Dna, Mail, UserRound } from 'lucide-react';
import { format } from 'date-fns';
import { User } from 'next-auth';
import { FC } from 'react';
import { uk } from 'date-fns/locale';
import { formatAge } from '../utils/date-utils';
import * as React from 'react';

interface ProfileCardProps {
  user: User;
  className?: string;
}

const ProfileCard: FC<ProfileCardProps> = ({ user, className }) => {
  const fullName = user?.name
    ? user.surname
      ? `${user.name} ${user.surname}`
      : user.name
    : '--';

  const role = user?.role === 'USER' ? 'Пацієнт' : 'Лікар';
  const birthDate = user?.birthDate
    ? format(user?.birthDate, 'PP', { locale: uk })
    : 'Не вказано';

  const gender = user?.gender === 'MALE' ? 'Чоловік' : 'Жінка';

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.image as string}
                alt={user?.email as string}
              />
              <AvatarFallback>
                <UserRound
                  size={32}
                  strokeWidth={2}
                  className="opacity-60"
                  aria-hidden="true"
                />
              </AvatarFallback>
            </Avatar>

            <Badge
              className="absolute hover:bg-primary cursor-default -top-2 -right-2"
              variant="default"
            >
              {role}
            </Badge>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold">{fullName}</h2>
            {user?.position && (
              <p className="text-muted-foreground">{user.position}</p>
            )}
          </div>

          <div className="w-full space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarFold className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {birthDate}
                {user.birthDate && <span>({formatAge(user.birthDate)})</span>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Dna className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{gender}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
