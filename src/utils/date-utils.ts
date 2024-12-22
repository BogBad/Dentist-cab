export const getDateOfBirth = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('uk-UA', options).format(date);
};

export const calculateEndTime = (startDate: Date, duration: number): Date => {
  const endDate = new Date(startDate);
  endDate.setMinutes(startDate.getMinutes() + duration);

  return endDate;
};

export const getTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Intl.DateTimeFormat('uk-UA', options).format(date);
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const differenceInYears = (date: Date): number => {
  const today = new Date();
  const birthDate = new Date(date);

  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

export const formatAge = (date: Date): string => {
  const age = differenceInYears(date);
  let suffix = '';

  if (age % 10 === 1 && age % 100 !== 11) {
    suffix = 'рік';
  } else if (
    [2, 3, 4].includes(age % 10) &&
    ![12, 13, 14].includes(age % 100)
  ) {
    suffix = 'роки';
  } else {
    suffix = 'років';
  }

  return `${age} ${suffix}`;
};
