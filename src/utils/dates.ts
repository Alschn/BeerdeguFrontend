export function getFirstAndLastDayOfMonth(date?: Date) {
  const d = date ?? new Date();

  const firstDayOfMonth = d;
  firstDayOfMonth.setDate(1);
  const lastDayOfMonth = new Date(firstDayOfMonth);
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
  lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);
  return [firstDayOfMonth, lastDayOfMonth] as const;
}

export function formatDateParam(date: Date) {
  let month = `${date.getMonth() + 1}`;
  let day = `${date.getDate()}`;
  const year = date.getFullYear();
  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  return [year, month, day].join("-");
}
