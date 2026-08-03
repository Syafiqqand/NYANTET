export function toDateInputValue(date = new Date()) {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function getDateRange(type, customStart, customEnd, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let start = today;
  let end = today;

  if (type === "week") {
    const weekday = today.getDay() || 7;
    start = new Date(today);
    start.setDate(today.getDate() - weekday + 1);
    end = new Date(start);
    end.setDate(start.getDate() + 6);
  }
  if (type === "month") {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
    end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }
  if (type === "year") {
    start = new Date(today.getFullYear(), 0, 1);
    end = new Date(today.getFullYear(), 11, 31);
  }
  if (type === "custom") {
    if (!isValidDateString(customStart) || !isValidDateString(customEnd)) {
      throw new Error("Masukkan tanggal mulai dan tanggal selesai yang valid.");
    }
    if (customStart > customEnd) {
      throw new Error("Tanggal mulai tidak boleh setelah tanggal selesai.");
    }
    return { start: customStart, end: customEnd };
  }

  return { start: toDateInputValue(start), end: toDateInputValue(end) };
}

export function isDateInRange(date, range) {
  return date >= range.start && date <= range.end;
}
