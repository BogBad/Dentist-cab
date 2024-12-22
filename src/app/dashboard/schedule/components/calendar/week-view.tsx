import { useEffect, useState } from 'react';
import type { CalendarEvent } from '../../../../../types/calendar';
import { getTime, isToday } from '../../../../../utils/date-utils';
import { Loader } from './loader';
import { filterEvents } from '../../../../../utils/filter-utils';
import { useSession } from 'next-auth/react';
import { getEventStyle, getOverlappingGroups } from '../../../../../utils/schedule-utils';
import { EventForm } from './event-form';
import { EventModal } from './event-modal';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { capitalize } from '../../../../../utils/string-utils';
import { toast } from 'sonner';

interface WeekViewProps {
  data: CalendarEvent[];
  currentDate: Date;
  isLoading: boolean;
  search: string | null;
  doctors: string[];
}

const WeekView = ({
  data,
  currentDate,
  isLoading,
  search,
  doctors,
}: WeekViewProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  const isDoctor = user?.role !== 'USER';

  const filters = { search, doctors: doctors || [] };

  const [events, setEvents] = useState<CalendarEvent[]>(data);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  const filteredEvents = filterEvents(events || [], filters);
  const groupedEvents = getOverlappingGroups(filteredEvents);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) + i;
    date.setDate(diff);
    return date;
  });

  const handleCellClick = (date: Date, hour: number) => {
    if (!isDoctor) return;
    const newDate = new Date(date);
    newDate.setHours(hour);
    setSelectedDate(newDate);
    setSelectedEvent(null);
    setIsEventFormOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (!isDoctor && event.patientId !== user?.id) {
      toast.info('Ви не маєте доступу до цього запису');
      return;
    }
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleEditClick = () => {
    if (!isDoctor) return;
    setIsEventModalOpen(false);
    setIsEventFormOpen(true);
  };

  const handleCloseModal = () => {
    setIsEventModalOpen(false);
    setIsEventFormOpen(false);
    setSelectedEvent(null);
  };

  useEffect(() => {
    if (data.length > 0 && events.length === 0) {
      setEvents(data);
    }
  }, [data, events]);

  return (
    <div className="flex-1 relative max-h-[85vh] border overflow-auto rounded-[6px] bg-background">
      <div className="relative grid grid-rows-1 border-b grid-cols-[auto_repeat(7,1fr)]">
        <div className="w-12" />
        {days.map((date) => (
          <div
            key={date.toISOString()}
            className="px-1 py-2 flex flex-col justify-center items-center border-l"
          >
            <div className="font-semibold text-foreground text-xs">
              {capitalize(format(date, 'EEE', { locale: uk }))}
            </div>
            <div
              className={`text-xs w-fit py-1 rounded-[6px] px-1.5 text-muted-foreground ${isToday(date) ? 'bg-primary text-white' : ''}`}
            >
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
      <div className="relative grid grid-cols-[auto_repeat(7,1fr)]">
        <div className="w-12">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-[40px] grid place-items-center border-b text-[10px] text-muted-foreground text-right"
            >
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>
          ))}
        </div>
        {days.map((date) => (
          <div key={date.toISOString()} className="relative border-l">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[40px] border-b"
                onClick={() => handleCellClick(date, hour)}
              />
            ))}
            {groupedEvents
              .flat()
              .filter(
                (event) =>
                  event.startDate.toDateString() === date.toDateString()
              )
              .map((event) => (
                <div
                  key={event.id}
                  className="absolute transition hover:scale-[1.03] left-0 right-0 mx-0.5 p-1 rounded-sm text-[10px] overflow-hidden cursor-pointer"
                  style={getEventStyle(event)}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="font-medium text-foreground truncate">
                    {event.title}
                  </div>
                  <div className="text-muted-foreground truncate">
                    {`${getTime(event.startDate)} - ${getTime(event.endDate)}`}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      {isLoading && <Loader />}

      {isEventFormOpen && (
        <EventForm
          setEvents={setEvents}
          isOpen={isEventFormOpen}
          onClose={handleCloseModal}
          defaultDate={selectedDate}
          event={selectedEvent}
        />
      )}

      {isEventModalOpen && selectedEvent && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          eventId={selectedEvent?.id || ''}
          onEdit={handleEditClick}
        />
      )}
    </div>
  );
};

export default WeekView;
