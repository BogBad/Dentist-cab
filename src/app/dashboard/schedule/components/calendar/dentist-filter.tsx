'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '../../../../../utils/cn';
import { Button } from '../../../../../components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../../../components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../../components/ui/popover';
import { api } from '../../../../../lib/trpc/client';
import { CommandLoading } from 'cmdk';
import { FC, useEffect } from 'react';
import { getColorByString } from '../../../../../utils/styles-utils';

interface DentistFilterProps {
  doctors: string[];
  setDoctors: (doctors: string[] | null) => void;
}

const DentistFilter: FC<DentistFilterProps> = ({ doctors, setDoctors }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState<string[]>(
    doctors || []
  );
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: fetchedDoctors, isLoading } = api.users.getEmployee.useQuery();

  const handleSelect = (currentValue: string) => {
    const selectedDoctor = fetchedDoctors?.find(
      (doctor) => `${doctor.name} ${doctor.surname}` === currentValue
    );
    if (selectedDoctor) {
      setSelectedValues((prev) =>
        prev.includes(selectedDoctor.id)
          ? prev.filter((value) => value !== selectedDoctor.id)
          : [...prev, selectedDoctor.id]
      );
    }
  };

  useEffect(() => {
    if (selectedValues.length === 0) {
      setDoctors(null);
    } else {
      setDoctors(selectedValues);
    }
  }, [selectedValues]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedValues.length > 0
            ? `${selectedValues.length} doctor${selectedValues.length > 1 ? 's' : ''} selected`
            : 'Обрати лікаря...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Шукати лікарів..."
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {isLoading && <CommandLoading />}
            <CommandEmpty>Не знайдено</CommandEmpty>
            <CommandGroup>
              {fetchedDoctors?.map((doctor) => {
                const backgroundColor = getColorByString(
                  doctor.surname || '',
                  0.3
                );
                return (
                  <CommandItem
                    key={doctor.id}
                    value={`${doctor.name} ${doctor.surname}`}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedValues.includes(doctor.id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <div
                      style={{ backgroundColor }}
                      className="size-4 rounded-full"
                    />
                    <span>{`${doctor.name} ${doctor.surname}`}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DentistFilter;
