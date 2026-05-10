import type { PlantRecord, WateringEventRecord, WateringReminderRecord } from "@/lib/plants/types";
import {
  getDayDifference,
  getReminderAwareWateringScheduleState,
  type WateringScheduleState,
} from "@/lib/watering/schedule";

const DASHBOARD_WINDOW_DAYS = 7;

export type DashboardPlant = {
  plant: PlantRecord;
  latestWateringEvent: WateringEventRecord | null;
  reminder: WateringReminderRecord | null;
  schedule: WateringScheduleState;
};

export type WateringDashboardGroups = {
  overdue: DashboardPlant[];
  dueToday: DashboardPlant[];
  upcoming: DashboardPlant[];
  recentlyWatered: DashboardPlant[];
  needsInterval: DashboardPlant[];
};

export function getLatestWateringEventByPlantId(events: WateringEventRecord[]) {
  const latestByPlantId = new Map<string, WateringEventRecord>();

  for (const event of events) {
    if (!latestByPlantId.has(event.plant_id)) {
      latestByPlantId.set(event.plant_id, event);
    }
  }

  return latestByPlantId;
}

export function getEnabledReminderByPlantId(reminders: WateringReminderRecord[]) {
  const reminderByPlantId = new Map<string, WateringReminderRecord>();

  for (const reminder of reminders) {
    if (reminder.enabled && reminder.next_reminder_date) {
      reminderByPlantId.set(reminder.plant_id, reminder);
    }
  }

  return reminderByPlantId;
}

export function getDashboardPlants(
  plants: PlantRecord[],
  events: WateringEventRecord[],
  reminders: WateringReminderRecord[] = [],
  today = new Date(),
) {
  const latestByPlantId = getLatestWateringEventByPlantId(events);
  const reminderByPlantId = getEnabledReminderByPlantId(reminders);

  return plants.map((plant) => {
    const latestWateringEvent = latestByPlantId.get(plant.id) ?? null;
    const reminder = reminderByPlantId.get(plant.id) ?? null;

    return {
      plant,
      latestWateringEvent,
      reminder,
      schedule: getReminderAwareWateringScheduleState(
        plant,
        latestWateringEvent,
        reminder,
        today,
      ),
    };
  });
}

export function getWateringDashboardGroups(
  plants: DashboardPlant[],
  today = new Date(),
): WateringDashboardGroups {
  const groups: WateringDashboardGroups = {
    overdue: [],
    dueToday: [],
    upcoming: [],
    recentlyWatered: [],
    needsInterval: [],
  };

  for (const item of plants) {
    if (item.schedule.status === "overdue") {
      groups.overdue.push(item);
    }

    if (item.schedule.status === "due-today" || item.schedule.status === "not-watered") {
      groups.dueToday.push(item);
    }

    if (
      item.schedule.status === "upcoming" &&
      item.schedule.nextWateringDate &&
      getDayDifference(today, item.schedule.nextWateringDate) <= DASHBOARD_WINDOW_DAYS
    ) {
      groups.upcoming.push(item);
    }

    if (
      item.latestWateringEvent &&
      getDayDifference(new Date(item.latestWateringEvent.watered_at), today) <=
        DASHBOARD_WINDOW_DAYS
    ) {
      groups.recentlyWatered.push(item);
    }

    if (item.schedule.status === "no-interval") {
      groups.needsInterval.push(item);
    }
  }

  return groups;
}

export function getDashboardAttentionCount(groups: WateringDashboardGroups) {
  return groups.overdue.length + groups.dueToday.length;
}
