import { Timestamp } from "firebase/firestore";

export default interface DefaultEntityType {
  id: string,
  created_at: Timestamp,
  updated_at?: Timestamp,
}