import DefaultEntityType from "./default";
import Event from "@/database/entities/event";

export default interface RegisterScheduleInterface extends DefaultEntityType {
    editData: Event;
}
