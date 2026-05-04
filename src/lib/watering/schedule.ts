import type { PlantRecord, WateringEventRecord } from "@/lib/plants/types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export type WateringScheduleState = {
  lastWateredAt: string | null;
  lastWateredLabel: string;
  nextWateringDate: Date | null;
  nextWateringLabel: string;
  status: "no-interval" | "not-watered" | "upcoming" | "due-today" | "overdue";
  helperText: string;
};

function getLocalDayStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getDayDifference(fromDate: Date, toDate: Date) {
  const fromDay = getLocalDayStart(fromDate).getTime();
  const toDay = getLocalDayStart(toDate).getTime();

  return Math.round((toDay - fromDay) / DAY_IN_MS);
}

function formatCalendarDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatLastWateredLabel(wateredAt: string | null, today = new Date()) {
  if (!wateredAt) {
    return "Not watered yet";
  }

  const wateredDate = new Date(wateredAt);
  const daysAgo = getDayDifference(wateredDate, today);

  if (daysAgo === 0) {
    return "Watered today";
  }

  if (daysAgo === 1) {
    return "Watered yesterday";
  }

  if (daysAgo > 1 && daysAgo < 7) {
    return `Watered ${daysAgo} days ago`;
  }

  return `Watered ${formatCalendarDate(wateredDate)}`;
}

export function getWateringScheduleState(
  plant: Pick<PlantRecord, "watering_interval_days">,
  latestWateringEvent: Pick<WateringEventRecord, "watered_at"> | null,
  today = new Date(),
): WateringScheduleState {
  const lastWateredAt = latestWateringEvent?.watered_at ?? null;
  const lastWateredLabel = formatLastWateredLabel(lastWateredAt, today);

  if (!plant.watering_interval_days) {
    return {
      lastWateredAt,
      lastWateredLabel,
      nextWateringDate: null,
      nextWateringLabel: "No watering interval set yet",
      status: "no-interval",
      helperText: "You can still record watering. Add an interval later to see a next date.",
    };
  }

  if (!lastWateredAt) {
    return {
      lastWateredAt,
      lastWateredLabel,
      nextWateringDate: null,
      nextWateringLabel: "No watering recorded yet",
      status: "not-watered",
      helperText: `Mark watered to start using the ${plant.watering_interval_days}-day interval.`,
    };
  }

  const nextWateringDate = addDays(new Date(lastWateredAt), plant.watering_interval_days);
  const daysUntilDue = getDayDifference(today, nextWateringDate);

  if (daysUntilDue < 0) {
    const overdueDays = Math.abs(daysUntilDue);

    return {
      lastWateredAt,
      lastWateredLabel,
      nextWateringDate,
      nextWateringLabel: `Overdue by ${overdueDays} day${overdueDays === 1 ? "" : "s"}`,
      status: "overdue",
      helperText: `Based on your ${plant.watering_interval_days}-day interval.`,
    };
  }

  if (daysUntilDue === 0) {
    return {
      lastWateredAt,
      lastWateredLabel,
      nextWateringDate,
      nextWateringLabel: "Due today",
      status: "due-today",
      helperText: `Based on your ${plant.watering_interval_days}-day interval.`,
    };
  }

  if (daysUntilDue === 1) {
    return {
      lastWateredAt,
      lastWateredLabel,
      nextWateringDate,
      nextWateringLabel: "Due tomorrow",
      status: "upcoming",
      helperText: `Based on your ${plant.watering_interval_days}-day interval.`,
    };
  }

  return {
    lastWateredAt,
    lastWateredLabel,
    nextWateringDate,
    nextWateringLabel: `Due in ${daysUntilDue} days`,
    status: "upcoming",
    helperText: `Based on your ${plant.watering_interval_days}-day interval.`,
  };
}
