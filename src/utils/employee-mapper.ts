import { Employee, ModifiedEmployee } from '../types/employee';
import { IUser } from '../types/user';

export const mapUserToEmployee = (user: IUser): ModifiedEmployee => {
  const fullName =
    user.name && user.surname ? `${user.name} ${user.surname}` : 'Не вказано';
  const position = user.position ?? 'Не вказано';

  return {
    ...user,
    fullName,
    position,
  };
};

export const employeeMapper = (users: Employee[]): ModifiedEmployee[] => {
  return users.map((user) => {
    const fullName =
      user.name && user.surname ? `${user.name} ${user.surname}` : 'Не вказано';
    const position = user.position ?? 'Не вказано';

    return {
      ...user,
      fullName,
      position,
    };
  });
};

export default employeeMapper;
