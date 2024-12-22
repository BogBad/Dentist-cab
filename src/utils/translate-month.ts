export const translateMonth = (month: string): string => {
  const monthTranslations: { [key: string]: string } = {
    January: 'Січень',
    February: 'Лютий',
    March: 'Березень',
    April: 'Квітень',
    May: 'Травень',
    June: 'Червень',
    July: 'Липень',
    August: 'Серпень',
    September: 'Вересень',
    October: 'Жовтень',
    November: 'Листопад',
    December: 'Грудень',
  };

  return monthTranslations[month] || month;
};
