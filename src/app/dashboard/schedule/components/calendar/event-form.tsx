import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CalendarEvent } from '@/types/calendar';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import DentistSelector from './dentist-selector';
import PatientSelector from './patient-selector';
import { calculateEndTime } from '@/utils/date-utils';
import ServiceSelector from './service-selector';
import { api } from '@/lib/trpc/client';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Loader } from './loader';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date;
  event?: CalendarEvent | null;
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

export function EventForm({
  isOpen,
  onClose,
  defaultDate = new Date(),
  event,
  setEvents,
}: EventFormProps) {
  const { data } = useSession();
  const user = data?.user;
  const isDoctor = user?.role !== 'USER';

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date>(defaultDate);
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [serviceId, setServiceId] = useState('');

  const { data: services, isLoading } = api.services.getServices.useQuery();

  const addEventMutation = api.schedule.addEvent.useMutation();
  const updateEventMutation = api.schedule.updateEvent.useMutation();
  const deleteEventMutation = api.schedule.deleteEvent.useMutation();

  const selectedService = services?.find((service) => service.id === serviceId);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartDate(event.startDate);
      setServiceId(event.serviceId);
      setDoctorId(event.doctorId);
      setPatientId(event.patientId);
    } else {
      setTitle('');
      const newDate = new Date(defaultDate);
      newDate.setHours(9, 0, 0, 0);
      setStartDate(newDate);
      setServiceId('');
      setDoctorId('');
      setPatientId('');
    }
  }, [event]);

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      setStartDate((prevDate) => {
        const newDate = new Date(date);
        newDate.setHours(prevDate.getHours());
        newDate.setMinutes(prevDate.getMinutes());
        return newDate;
      });
    }
  }

  function handleTimeChange(type: 'hour' | 'minute', value: string) {
    setStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (type === 'hour') {
        newDate.setHours(parseInt(value, 10));
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(value, 10));
      }
      return newDate;
    });
  }

  const handleEventSave = async (eventData: CalendarEvent) => {
    if (!isDoctor) return;
    try {
      if (event) {
        await updateEventMutation.mutateAsync(eventData);
        setEvents((prevEvents) =>
          prevEvents.map((prevEvent) =>
            prevEvent.id === event.id ? eventData : prevEvent
          )
        );
        toast.success('Подію успішно оновлено');
      } else {
        (await addEventMutation.mutateAsync(
          eventData
        )) as unknown as CalendarEvent;
        setEvents((prevEvents) => [...prevEvents, eventData]);
        toast.success('Подію успішно створено');
      }
    } catch (error) {
      toast.error('Помилка при збереженні події');
    }
    onClose();
  };

  const handleEventDelete = async (eventId: string) => {
    if (!isDoctor && !event) return;
    try {
      await deleteEventMutation.mutateAsync({ id: eventId });
      toast.success('Подію успішно видалено');
      setEvents((prevEvents) =>
        prevEvents.filter((prevEvent) => prevEvent.id !== eventId)
      );
    } catch (error) {
      toast.error('Помилка при видаленні події');
    }
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDoctor) return;
    if (startDate && selectedService && doctorId && patientId && serviceId) {
      const eventData: CalendarEvent = {
        id: event ? event.id : '',
        title,
        startDate,
        endDate: calculateEndTime(startDate, selectedService.duration),
        doctorId,
        patientId,
        serviceId,
      };
      handleEventSave(eventData);
      onClose();
    }
  };

  if (!isDoctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        {isLoading ? (
          <div className="min-h-[519px] flex justify-center items-center h-full">
            <Loader />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">
                {event ? 'Редагувати подію' : 'Додати подію'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-sm">
                  Назва
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Введіть назву"
                  required
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Дата і час початку</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      {startDate ? (
                        format(startDate, 'dd MMM yyyy HH:mm')
                      ) : (
                        <span>Оберіть дату і час</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <div className="sm:flex">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                      <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 24 }, (_, i) => i).map(
                              (hour) => (
                                <Button
                                  key={hour}
                                  size="icon"
                                  variant={
                                    startDate.getHours() === hour
                                      ? 'default'
                                      : 'ghost'
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleTimeChange('hour', hour.toString())
                                  }
                                >
                                  {hour}
                                </Button>
                              )
                            )}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                          <div className="flex sm:flex-col p-2">
                            {Array.from({ length: 12 }, (_, i) => i * 5).map(
                              (minute) => (
                                <Button
                                  key={minute}
                                  size="icon"
                                  variant={
                                    startDate.getMinutes() === minute
                                      ? 'default'
                                      : 'ghost'
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleTimeChange(
                                      'minute',
                                      minute.toString()
                                    )
                                  }
                                >
                                  {minute.toString().padStart(2, '0')}
                                </Button>
                              )
                            )}
                          </div>
                          <ScrollBar
                            orientation="horizontal"
                            className="sm:hidden"
                          />
                        </ScrollArea>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              {services && (
                <div className="space-y-1">
                  <Label className="text-sm">Послуга</Label>
                  <ServiceSelector
                    services={services}
                    isLoading={isLoading}
                    selectedValue={serviceId}
                    setSelectedValue={setServiceId}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-sm">Лікар</Label>
                <DentistSelector
                  selectedValue={doctorId}
                  setSelectedValue={setDoctorId}
                />
              </div>
              <div>
                <Label className="text-sm">Пацієнт</Label>
                <PatientSelector
                  selectedValue={patientId}
                  setSelectedValue={setPatientId}
                />
              </div>
              <div
                className={cn(
                  `flex w-full`,
                  event ? 'justify-between' : 'justify-end'
                )}
              >
                {isDoctor && event && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleEventDelete(event.id)}
                    className="h-8 text-sm"
                  >
                    Видалити
                  </Button>
                )}

                <div className="flex self-end justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="h-8 text-sm"
                  >
                    Скасувати
                  </Button>
                  <Button type="submit" className="h-8 text-sm">
                    Зберегти
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
