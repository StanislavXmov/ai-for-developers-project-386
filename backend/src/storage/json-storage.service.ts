import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { AdminSlot, Booking, EventType } from "../entities";

interface StorageData {
  eventTypes: EventType[];
  bookings: Booking[];
  adminSlots: AdminSlot[];
}

const defaultData: StorageData = {
  eventTypes: [
    {
      id: "1",
      name: "Consultation",
      description: "30-minute consultation call",
      durationMinutes: 30,
    },
    {
      id: "2",
      name: "Demo",
      description: "Product demo session",
      durationMinutes: 60,
    },
  ],
  bookings: [],
  adminSlots: [],
};

@Injectable()
export class JsonStorageService {
  private readonly filePath = resolve(
    __dirname,
    "..",
    "..",
    "..",
    "storage",
    "data.json",
  );
  private data: StorageData;

  constructor() {
    this.ensureStorageFile();
    this.data = this.readData();
  }

  getEventTypes(): EventType[] {
    return this.data.eventTypes;
  }

  addEventType(eventType: EventType): EventType {
    this.data.eventTypes.push(eventType);
    this.save();
    return eventType;
  }

  getBookings(): Booking[] {
    return this.data.bookings;
  }

  addBooking(booking: Booking): Booking {
    this.data.bookings.push(booking);
    this.save();
    return booking;
  }

  getAdminSlots(): AdminSlot[] {
    return this.data.adminSlots;
  }

  replaceAdminSlots(slots: AdminSlot[]): AdminSlot[] {
    this.data.adminSlots = slots;
    this.save();
    return this.data.adminSlots;
  }

  private ensureStorageFile(): void {
    if (existsSync(this.filePath)) {
      return;
    }

    mkdirSync(dirname(this.filePath), { recursive: true });
    writeFileSync(
      this.filePath,
      `${JSON.stringify(defaultData, null, 2)}\n`,
      "utf8",
    );
  }

  private readData(): StorageData {
    const rawData = readFileSync(this.filePath, "utf8");
    const parsed = JSON.parse(rawData) as Partial<StorageData>;

    return {
      eventTypes: parsed.eventTypes ?? defaultData.eventTypes,
      bookings: parsed.bookings ?? defaultData.bookings,
      adminSlots: parsed.adminSlots ?? defaultData.adminSlots,
    };
  }

  private save(): void {
    writeFileSync(
      this.filePath,
      `${JSON.stringify(this.data, null, 2)}\n`,
      "utf8",
    );
  }
}
