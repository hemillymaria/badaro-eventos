import DefaultEntityType from "./default";

export default interface Event extends DefaultEntityType {
  name: string,
  date: string,
  address: {
    city: string,
    street: string,
    neighborhood: string,
  },
  status: boolean,
  createdBy: string,

  image?: Blob,
  image_url: string,
  image_ref: string,
}