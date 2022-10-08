export function getDate(date: string | Date) {
  const _date = new Date(date);
  if (isNaN(_date.getTime())) return null;
  return _date.toISOString().split("T")[0];
}
