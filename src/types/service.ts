import { z } from 'zod';

export const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty('Поле не може бути пустим'),
  description: z.string().nullable(),
  price: z.coerce.number().int().positive('Ціна повинна бути більше 0'),
  duration: z.coerce
    .number()
    .int()
    .positive('Тривалість повинна бути більше 0'),
});

export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
}
