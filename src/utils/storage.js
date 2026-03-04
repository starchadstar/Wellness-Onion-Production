const STORAGE_KEY = 'video-project-board-2026';

// Color template indexed by month number (0 = January, 11 = December)
// Same month number always gets the same color, regardless of year
export const MONTH_TEMPLATE = [
  { name: 'January',   short: 'JAN', color: '#D4B896', shadow: '#B89A7A', accent: '#8B6F5A' },
  { name: 'February',  short: 'FEB', color: '#C17F5E', shadow: '#A06445', accent: '#7A4A30' },
  { name: 'March',     short: 'MAR', color: '#8B9E7E', shadow: '#6E8162', accent: '#4F6349' },
  { name: 'April',     short: 'APR', color: '#C9A87C', shadow: '#AE8D60', accent: '#8A6D44' },
  { name: 'May',       short: 'MAY', color: '#B5A36B', shadow: '#9A8850', accent: '#776735' },
  { name: 'June',      short: 'JUN', color: '#A67B5B', shadow: '#8C6140', accent: '#6A4525' },
  { name: 'July',      short: 'JUL', color: '#CC8B65', shadow: '#B07049', accent: '#8B5232' },
  { name: 'August',    short: 'AUG', color: '#7A9E7E', shadow: '#5D8161', accent: '#3E6345' },
  { name: 'September', short: 'SEP', color: '#B56B5E', shadow: '#9A5044', accent: '#7A3328' },
  { name: 'October',   short: 'OCT', color: '#9E7A5A', shadow: '#835F3F', accent: '#634424' },
  { name: 'November',  short: 'NOV', color: '#C4A882', shadow: '#A98D66', accent: '#856C4A' },
  { name: 'December',  short: 'DEC', color: '#6B8E7A', shadow: '#4E7160', accent: '#315345' },
];

export function getMonthConfig(monthId) {
  const [year, month] = monthId.split('-').map(Number);
  const t = MONTH_TEMPLATE[month - 1];
  return { id: monthId, year, ...t };
}

export const DEFAULT_MONTH_LIST = [
  '2026-01','2026-02','2026-03','2026-04','2026-05','2026-06',
  '2026-07','2026-08','2026-09','2026-10','2026-11','2026-12',
];

// Keep MONTHS export for any remaining references
export const MONTHS = DEFAULT_MONTH_LIST.map(getMonthConfig);

export function getNextMonthId(monthList) {
  if (!monthList || monthList.length === 0) return '2026-01';
  const last = monthList[monthList.length - 1];
  const [year, month] = last.split('-').map(Number);
  if (month === 12) return `${year + 1}-01`;
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function addMonthToData(data) {
  const monthList = data.monthList || DEFAULT_MONTH_LIST;
  const nextId = getNextMonthId(monthList);
  return { ...data, monthList: [...monthList, nextId] };
}

export function getDaysInMonth(monthId) {
  const [year, month] = monthId.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const day = String(d).padStart(2, '0');
    days.push(`${year}-${String(month).padStart(2, '0')}-${day}`);
  }
  return days;
}

export function getFirstDayOfMonth(monthId) {
  const [year, month] = monthId.split('-').map(Number);
  return new Date(year, month - 1, 1).getDay();
}

export function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

const defaultDayData = () => ({ todos: [], scripts: [], notes: '' });
const defaultMonthData = () => ({ completed: false, days: {} });

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      monthList: parsed.monthList || DEFAULT_MONTH_LIST,
      months: parsed.months || {},
    };
  } catch {
    return { monthList: DEFAULT_MONTH_LIST, months: {} };
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getMonthData(data, monthId) {
  return data.months[monthId] || defaultMonthData();
}

export function getDayData(data, monthId, dayId) {
  const month = getMonthData(data, monthId);
  return month.days[dayId] || defaultDayData();
}

export function updateMonthCompleted(data, monthId, completed) {
  const updated = { ...data };
  if (!updated.months[monthId]) updated.months[monthId] = defaultMonthData();
  updated.months[monthId] = { ...updated.months[monthId], completed };
  return updated;
}

export function updateDayData(data, monthId, dayId, dayData) {
  const updated = { ...data };
  if (!updated.months[monthId]) updated.months[monthId] = defaultMonthData();
  if (!updated.months[monthId].days) updated.months[monthId].days = {};
  updated.months[monthId].days[dayId] = dayData;
  return updated;
}

export function getMonthStats(data, monthId) {
  const month = getMonthData(data, monthId);
  let totalTodos = 0, completedTodos = 0;
  Object.values(month.days || {}).forEach(day => {
    (day.todos || []).forEach(t => {
      totalTodos++;
      if (t.checked) completedTodos++;
    });
  });
  return { totalTodos, completedTodos };
}
