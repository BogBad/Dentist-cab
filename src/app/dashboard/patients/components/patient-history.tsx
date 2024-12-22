import { Badge } from '../../../../components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../../components/ui/card';
import { PatientEvent } from '../../../../types/patient';
import { FC } from 'react';
import { CalendarCheck } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface PatientHistoryProps {
  patientEvents: PatientEvent[];
}

const PatientHistory: FC<PatientHistoryProps> = ({ patientEvents }) => {
  const eventHeight = 155;
  const eventLineHeight = (patientEvents.length - 1) * eventHeight;

  const sortedPatientEvents = patientEvents.sort(
    (a, b) => b.startDate.getTime() - a.startDate.getTime()
  );

  return (
    <Card className="max-h-[85vh] overflow-y-auto">
      <CardHeader>
        <CardTitle>Історія візитів</CardTitle>
        <CardDescription>Хронологія стоматологічних прийомів</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div
            className={`absolute left-[11px] top-1 w-0.5 bg-primary/20`}
            style={{ height: `${eventLineHeight}px` }}
          />
          {sortedPatientEvents.length > 0 ? (
            sortedPatientEvents.map((record, index) => (
              <div key={index} className="mb-8 flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className="z-10 rounded-full h-6 w-6 flex items-center outline outline-[10px] outline-background justify-center bg-secondary text-blue-800">
                    <CalendarCheck className="z-30 h-2.5 w-2.5 text-primary" />
                  </div>
                  {index !== patientEvents.length - 1 && (
                    <div className="h-full w-0.5 bg-gray-200"></div>
                  )}
                </div>
                <Card className="flex-grow">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge>{record.service.duration} хв</Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(record.startDate, 'PP', { locale: uk })}
                      </span>
                    </div>
                    <CardTitle className="text-base">
                      {record.service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-muted-foreground">
                      Лікар: {record.doctor.name} {record.doctor.surname}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-36 w-full">
              <p className="text-muted-foreground">
                Немає записів про візити пацієнта
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientHistory;
