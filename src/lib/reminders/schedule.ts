import type { PlantRecord, WateringEventRecord, WateringReminderRecord } from "@/lib/plants/types";
import { getDayDifference } from "@/lib/watering/schedule";

export type ReminderSummary = {
  label: string;
  helperText: string;
  dateInputValue: string;
};

function getLocalDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function addReminderDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getDerivedNextReminderDate(
  plant: Pick<PlantRecord, "watering_interval_days">,
  latestWateringEvent: Pick<WateringEventRecord, "watered_at"> | null,
) {
  if (!plant.watering_interval_days || !latestWateringEvent) {
    return null;
  }

  return getLocalDateValue(
    addReminderDays(new Date(latestWateringEvent.watered_at), plant.watering_interval_days),
  );
}

export function getTodayDateInputValue(today = new Date()) {
  return getLocalDateValue(today);
}

export function getReminderDateLabel(dateValue: string, today = new Date()) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const reminderDate = new Date(year, month - 1, day);
  const daysUntil = getDayDifference(today, reminderDate);

  if (daysUntil === 0) {
    return "Today";
  }

  if (daysUntil === 1) {
    return "Tomorrow";
  }

  if (daysUntil === -1) {
    return "Yesterday";
  }

  if (daysUntil > 1 && daysUntil < 7) {
    return `In ${daysUntil} days`;
  }

  if (daysUntil < -1) {
    return `${Math.abs(daysUntil)} days ago`;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(reminderDate);
}

export function getReminderSummary(
  reminder: WateringReminderRecord | null,
  plant: Pick<PlantRecord, "watering_interval_days">,
  latestWateringEvent: Pick<WateringEventRecord, "watered_at"> | null,
): ReminderSummary {
  const derivedDate = getDerivedNextReminderDate(plant, latestWateringEvent);
  const dateInputValue = reminder?.next_reminder_date ?? derivedDate ?? "";

  if (!reminder) {
    return {
      label: "No reminder set",
      helperText:
        derivedDate && plant.watering_interval_days
          ? `Ready to use your ${plant.watering_interval_days}-day watering interval.`
          : "Choose a date to set a Plant Care watering reminder.",
      dateInputValue,
    };
  }

  if (!reminder.enabled) {
    return {
      label: "Reminder off",
      helperText: "This reminder is saved in Plant Care but currently paused.",
      dateInputValue,
    };
  }

  if (!reminder.next_reminder_date) {
    return {
      label: "Choose a date",
      helperText: "Add a next reminder date before turning this into a useful cue.",
      dateInputValue,
    };
  }

  return {
    label: `Next reminder: ${getReminderDateLabel(reminder.next_reminder_date)}`,
    helperText: plant.watering_interval_days
      ? `Based on your ${plant.watering_interval_days}-day watering interval. Plant Care keeps this reminder.`
      : "Plant Care keeps this reminder. Add a watering interval later if you want automatic date updates after watering.",
    dateInputValue,
  };
}
