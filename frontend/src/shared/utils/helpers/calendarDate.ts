export const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
export const isWeekDay = (date: Date) => {
  const day = date.getDay();
  return day !== 0 && day !== 6;
};
export const isPastDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};
