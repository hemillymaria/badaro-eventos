import {app} from '../config'
import {
  getFirestore,
  collection,
  getDocs,
  query,
  QueryConstraint,
  getDoc,
  DocumentReference,
  DocumentData,
  doc,
  Unsubscribe,
  onSnapshot,
  CollectionReference,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import {
  FirebaseStorage,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  StorageReference,
  deleteObject,
} from 'firebase/storage'

abstract class FirestorePipe {
  protected readonly colRefStr: string
  protected readonly colRef: CollectionReference<DocumentData>
  protected readonly storage: FirebaseStorage

  constructor(colRefStr: string) {
    this.colRefStr = colRefStr
    this.colRef = collection(getFirestore(app), colRefStr)
    this.storage = getStorage(app)
  }

  private dbDoc(id: string): DocumentReference<DocumentData> {
    return doc(getFirestore(app), this.colRefStr, id)
  }

  protected _define<T>(id: string, data: T): Promise<any> {
    return setDoc(this.dbDoc(id), data as any)
  }

  protected async _create<T>(data: T): Promise<string> {
    const result = await addDoc(this.colRef, {
      ...data,
      created_at: serverTimestamp(),
    } as any)
    return result.id
  }

  protected _update<T>(id: string, data: T): Promise<void> {
    return updateDoc(this.dbDoc(id), {
      ...data,
      updated_at: serverTimestamp(),
    } as any)
  }

  protected _delete(id: string): Promise<void> {
    return deleteDoc(this.dbDoc(id))
  }

  protected async _getAll<T>(...params: QueryConstraint[]): Promise<T[]> {
    const snapshot = await getDocs(query(this.colRef, ...params))
    const datas: T[] = []
    snapshot.forEach((doc) =>
      datas.push({ id: doc.id, ...(doc.data() as any) }),
    )
    return datas
  }

  protected async _get<T>(id: string): Promise<T> {
    const docSnap = await getDoc(this.dbDoc(id))
    if (!docSnap.exists()) throw new Error('Register not found')
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as any
  }

  protected _on<T>(
    listener: (data: T[]) => void,
    ...params: QueryConstraint[]
  ): Unsubscribe {
    return onSnapshot(query(this.colRef, ...params), (snapshot) => {
      const datas: T[] = []
      snapshot.forEach((doc) =>
        datas.push({ id: doc.id, ...(doc.data() as any) } as T),
      )
      listener(datas)
    })
  }

  protected async uploadFile(
    name: string,
    data: Blob,
  ): Promise<{ ref: StorageReference; url: string }> {
    const storageRef = ref(this.storage, `${this.colRefStr}/${name}`)
    const snapshot = await uploadBytes(storageRef, data)
    const url = await getDownloadURL(snapshot.ref)
    return { url, ref: snapshot.ref }
  }

  protected async deleteFile(reference: string) {
    const desertRef = ref(this.storage, reference)
    return await deleteObject(desertRef)
  }

  protected _onDicionary(
    listener: (data: any) => void,
    ...params: QueryConstraint[]
  ): Unsubscribe {
    return onSnapshot(query(this.colRef, ...params), (snapshot) => {
      const dicionary: any = {}
      snapshot.forEach((doc) => (dicionary[doc.id] = doc.data()))
      listener(dicionary)
    })
  }

  abstract getAll(...params: QueryConstraint[]): Promise<any[]>
  abstract get(id: string): Promise<any>
  abstract on(listener: (data: any[]) => void): Unsubscribe
  abstract create(data: any): Promise<any>
  abstract update(id: string, data: any): Promise<any>
  abstract delete(id: string): Promise<any>
}

export default FirestorePipe
