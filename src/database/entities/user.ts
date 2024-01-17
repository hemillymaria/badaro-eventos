import DefaultEntityType from "./default";

export default interface User extends DefaultEntityType {
  name: string,
  email: string,
  role: 'superAdmin' | 'commonUser' 
}