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
import { CommandLoading } from 'cmdk';
import { FC } from 'react';
import { Service } from '../../../../../types/service';

interface ServiceSelectorProps {
  services: Service[];
  isLoading: boolean;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

const ServiceSelector: FC<ServiceSelectorProps> = ({
  services,
  isLoading,
  selectedValue,
  setSelectedValue,
}) => {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredServices = services?.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedService = services?.find(
    (service) => service.id === selectedValue
  );

  const selectedServiceValue = selectedService
    ? `${selectedService.name} - ${selectedService.duration} хв`
    : 'Обрати послугу...';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedServiceValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Шукати послугу..."
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            {isLoading && <CommandLoading />}
            <CommandEmpty>Не знайдено</CommandEmpty>
            <CommandGroup>
              {filteredServices?.map((service) => (
                <CommandItem
                  key={service.id}
                  value={service.name}
                  onSelect={(value) => {
                    const foundService = services.find(
                      (service) => service.name === value
                    );
                    setSelectedValue(foundService?.id as string);
                    setOpen(false);
                  }}
                >
                  {service.name} - {service.duration} хв
                  <Check
                    className={cn(
                      'ml-auto',
                      selectedValue === service.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ServiceSelector;
