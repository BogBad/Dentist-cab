import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CalendarView } from '@/types/calendar';
import { useQueryState } from 'nuqs';
import { useEffect } from 'react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { capitalize } from '@/utils/string-utils';

interface CalendarHeaderProps {
  currentDate: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onClickToday: () => void;
  search: string | null;
  setSearch: (search: string | null) => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  onClickToday,
  search,
  setSearch,
}: CalendarHeaderProps) {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setSearch(null);
      return;
    }
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search === '') {
      setSearch(null);
      return;
    }
    setSearch(search || null);
  }, []);

  return (
    <header className="flex items-center justify-between px-2 pb-2 bg-background rounded-tr-lg">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-foreground">Календар</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('prev')}
          className="h-7 w-7 p-0"
        >
          <ChevronLeft />
        </Button>
        <h2 className="text-sm font-medium text-foreground px-2">
          {capitalize(format(currentDate, 'MMM yyyy', { locale: uk }))}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('next')}
          className="h-7 w-7 p-0"
        >
          <ChevronRight />
        </Button>
        <Button
          onClick={onClickToday}
          variant="secondary"
          size="sm"
          className="text-xs"
        >
          Сьогодні
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-40">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Пошук"
            onChange={handleSearch}
            className="pl-7 h-7 text-xs"
          />
        </div>
        <ToggleGroup
          type="single"
          size="sm"
          value={view}
          onValueChange={(v) => onViewChange(v as any)}
        >
          <ToggleGroupItem value="week" className="text-xs">
            Т
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </header>
  );
}
