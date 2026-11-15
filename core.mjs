// Pure dose logic shared by the browser, the cron job and the tests (single source of truth).
export const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const addDays = (d, n) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10);

// A medicine version applies to a dose from its start moment until (excluding) its end moment.
export const act = (m, d, t) =>
  (m.start_date < d || (m.start_date === d && t >= m.start_time)) &&
  (!m.end_date || m.end_date > d || (m.end_date === d && t < m.end_time));

export const dosesFor = (meds, d) =>
  meds.flatMap((m) => m.times.filter((t) => act(m, d, t)).map((t) => ({ m, t, date: d }))).sort((a, b) => a.t.localeCompare(b.t));

export const logStatus = (logs, d, medId, t) => (logs.find((l) => l.dose_date === d && l.med_id === medId && l.dose_time === t) || {}).status;

export function doseStatus(logged, nowT, doseT) {
  if (logged) return logged;
  const diff = mins(nowT) - mins(doseT);
  return diff > 30 ? 'missed' : diff >= -10 ? 'due' : 'later';
}

export function adherence(meds, logs, today, nowT, days = 7) {
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const ds = addDays(today, -i);
    const all = dosesFor(meds, ds).filter((x) => ds < today || x.t <= nowT);
    out.push({ ds, total: all.length, taken: all.filter((x) => logStatus(logs, ds, x.m.id, x.t) === 'taken').length });
  }
  return out;
}
