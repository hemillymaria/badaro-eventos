
import User from "@/database/entities/user";
import Event from "@/database/entities/event";

export default interface DefaultContextInterface {
  user: User | null,
  events: Event[],
  eventsHome: Event[]
  usersdicionary: User[]

}