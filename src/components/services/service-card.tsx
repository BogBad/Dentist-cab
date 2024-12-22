import { FC } from 'react';
import { Service } from '../../types/service';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: FC<ServiceCardProps> = ({ service }) => {
  return (
    <Card className="w-full max-w-md bg-card text-card-foreground shadow-xl">
      <CardHeader className="bg-primary/10 rounded-t-[11px] p-6">
        <CardTitle className="text-2xl font-bold">{service.name}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {service.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 grid gap-4">
        <Badge className="text-xl">40% OFF</Badge>
        <Button className="w-full">Buy Now</Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
