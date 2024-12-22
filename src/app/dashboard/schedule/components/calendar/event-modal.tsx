import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../../../components/ui/dialog';
import { Button } from '../../../../../components/ui/button';
import { format } from 'date-fns';
import { Calendar, Clock, User, Stethoscope, Syringe } from 'lucide-react';
import { SingleEvent } from '../../../../../types/calendar';
import { api } from '../../../../../lib/trpc/client';
import { Badge } from '../../../../../components/ui/badge';
import { getColorByString } from '../../../../../utils/styles-utils';
import { useSession } from 'next-auth/react';
import { Loader } from './loader';
import { uk } from 'date-fns/locale';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onEdit: () => void;
}

export function EventModal({
  isOpen,
  onClose,
  eventId,
  onEdit,
}: EventModalProps) {
  const { data } = useSession();
  const user = data?.user;
  const isDoctor = user?.role !== 'USER';

  if (!eventId) return null;

  const { data: event, isLoading } =
    api.schedule.getEvent.useQuery<SingleEvent>({
      id: eventId,
    });

  const backgroundColor = getColorByString(event?.doctor?.surname || '', 0.2);

  if (!event && !isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {isLoading ? (
          <div className="min-h-[519px] flex justify-center items-center h-full">
            <Loader />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <div
                  style={{ backgroundColor }}
                  className="h-5 w-5 rounded-full"
                />
                {event.title}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Дата</p>
                  <p className="text-sm text-muted-foreground">
                    {format(event.startDate, 'PP', { locale: uk })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Час</p>
                  <p className="text-sm text-muted-foreground">
                    {`${format(event.startDate, 'HH:mm')} - ${format(event.endDate, 'HH:mm')}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Syringe className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Сервіс</p>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {event.service.name}
                    </p>
                    <Badge className="pointer-events-none">
                      {event.service.price} грн
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Stethoscope className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Лікар</p>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {event.doctor.name} {event.doctor.surname}
                    </p>
                    <Badge className="pointer-events-none">
                      {event.doctor.position}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Пацієнт</p>
                  <p className="text-sm text-muted-foreground">
                    {event.patient.name} {event.patient.surname}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Закрити
              </Button>
              {isDoctor && <Button onClick={onEdit}>Редагувати</Button>}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
