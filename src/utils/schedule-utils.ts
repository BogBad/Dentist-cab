import type { CalendarEvent, EventWithPosition } from '../types/calendar';
import { getColorByString } from './styles-utils';

export const isOverlapping = (event1: CalendarEvent, event2: CalendarEvent) => {
  return event1.startDate < event2.endDate && event2.startDate < event1.endDate;
};

export const getOverlappingGroups = (
  dayEvents: CalendarEvent[]
): EventWithPosition[][] => {
  const sortedEvents = dayEvents.sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );
  const groups: EventWithPosition[][] = [];

  sortedEvents.forEach((event) => {
    let overlappingGroup = groups.find((group) =>
      group.some((groupEvent) => isOverlapping(groupEvent, event))
    );

    if (overlappingGroup) {
      overlappingGroup.push({
        ...event,
        column: overlappingGroup.length,
        totalColumns: overlappingGroup.length + 1,
      });
      overlappingGroup.forEach(
        (e) => (e.totalColumns = overlappingGroup!.length)
      );
    } else {
      groups.push([{ ...event, column: 0, totalColumns: 1 }]);
    }
  });

  return groups;
};

export const getEventStyle = (event: EventWithPosition) => {
  const startHour = event.startDate.getHours();
  const startMinute = event.startDate.getMinutes();
  const endHour = event.endDate.getHours();
  const endMinute = event.endDate.getMinutes();

  const top = (startHour + startMinute / 60) * 40;
  const height =
    (endHour + endMinute / 60 - (startHour + startMinute / 60)) * 40;

  const backgroundColor = getColorByString(event?.doctor?.surname || '', 0.2);

  const width = 100 / event.totalColumns;
  const left = event.column * width;

  return {
    top: `${top}px`,
    minHeight: `${height}px`,
    backgroundColor,
    width: `calc(${width}% - 3px)`,
    left: `calc(${left}%`,
    marginRight: '3px',
  };
};
