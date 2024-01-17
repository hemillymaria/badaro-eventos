import { QueryConstraint, Unsubscribe } from "firebase/firestore";
import Event from "../entities/event";
import FirestorePipe from "../utils/pipe";

class EventDB extends FirestorePipe {

  public static readonly colName = 'Events'

  constructor() {
    super(EventDB.colName);
  }

  public createWithCustomId(id: string, data: Event): Promise<any> {
    return this._define(id, data);
  }



  public async create(data: Event): Promise<any> {
    console.log(data, 'EVENTO');
    try {
      await this.saveFile(data);
      return await this._create(data);
    } catch (error: any) {
      if (data.image_ref) {
        await this.deleteFile(data.image_ref)
      }
      throw error.message
    }
  }
  public update(id: string, data: Event): Promise<any> {
    return this._update(id, data);
  }
  public delete(id: string): Promise<any> {
    return this._delete(id);
  }
  public getAll(...params: QueryConstraint[]): Promise<Event[]> {
    return this._getAll<Event>(...params);
  }
  public get(id: string): Promise<Event> {
    return this._get(id);
  }
  public on(listener: (data: Event[]) => void, ...params: QueryConstraint[]): Unsubscribe {
    return this._on(listener, ...params);
  }

  private async saveFile(data: Event) {
    if (data.image) {
      const resultUpload = await this.uploadFile(new Date().getTime().toString(), data.image);
      data.image_ref = resultUpload.ref.fullPath;
      data.image_url = resultUpload.url;
    }
    delete data.image
  }

}

export default EventDB;