import type { PlantRecord, WateringEventRecord, WateringReminderRecord } from "@/lib/plants/types";
import { getDayDifference } from "@/lib/watering/schedule";

export type ReminderSummary = {
  label: string;
  helperText: string;
  dateInputValue: string;
  mode: WateringReminderRecord["reminder_mode"];
  previewText: string;
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

export function addReminderDaysToDateValue(dateValue: string, days: number) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return getLocalDateValue(addReminderDays(new Date(year, month - 1, day), days));
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
  const mode = reminder?.reminder_mode ?? "after_watering";
  const intervalText = plant.watering_interval_days
    ? `${plant.watering_interval_days}-day watering interval`
    : "watering interval";

  if (!reminder) {
    return {
      label: "No reminder set",
      helperText:
        derivedDate && plant.watering_interval_days
          ? `Ready to use your ${plant.watering_interval_days}-day watering interval.`
          : "Choose a date to set a Plant Care watering reminder.",
      dateInputValue,
      mode,
      previewText:
        derivedDate && plant.watering_interval_days
          ? `After I water will remind you ${plant.watering_interval_days} days after the latest watering.`
          : "Add a watering interval to preview reminder timing.",
    };
  }

  if (!reminder.enabled) {
    return {
      label: "Reminder off",
      helperText: "This reminder is saved in Plant Care but currently paused.",
      dateInputValue,
      mode,
      previewText: plant.watering_interval_days
        ? `Turn it on to use your ${intervalText}.`
        : "Add a watering interval before choosing reminder timing.",
    };
  }

  if (!reminder.next_reminder_date) {
    return {
      label: "Choose a date",
      helperText: "Add a next reminder date before turning this into a useful cue.",
      dateInputValue,
      mode,
      previewText: plant.watering_interval_days
        ? `Choose the next date for your ${intervalText}.`
        : "Add a watering interval before choosing reminder timing.",
    };
  }

  return {
    label: `Next reminder: ${getReminderDateLabel(reminder.next_reminder_date)}`,
    helperText:
      mode === "after_watering"
        ? `After I water: Plant Care uses your ${intervalText} after each watering.`
        : `Fixed schedule: watering early does not reset this saved reminder date.`,
    dateInputValue,
    mode,
    previewText:
      mode === "after_watering"
        ? "Mark watered updates the next reminder from the watering date."
        : "Mark watered records care, but this reminder keeps its fixed date unless you edit or snooze it.",
  };
}
