import { AdminSlots } from "../components/AdminSlots";
import { EventTypes } from "../components/EventTypes";

export function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium text-black mb-2">Admin</h1>
      <div className="space-y-8">
        <AdminSlots />
        <EventTypes />
      </div>
    </div>
  );
}