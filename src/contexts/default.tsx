
import React, { useEffect, useState } from 'react'
import { createContext } from "react";
import { useSession } from 'next-auth/react';
import DefaultContextInterface from '@/interfaces/default.interface';
import User from '@/database/entities/user';
import { ROLE_PT_BR } from '@/types/roles';
import EventDB from '@/database/wrappers/event';
import { where } from 'firebase/firestore';
import Event from '@/database/entities/event';
import UserDB from '@/database/wrappers/user';
export const DefaultContext = createContext<DefaultContextInterface>({} as any)

export default function DefaultProvider({ children }: any) {
  const { data: session } = useSession();
  let userSession: any = session;
  const [user, setuser] = useState<User | null>(null);
  const [events, setevents] = useState<Event[]>([]);
  const [eventsHome, seteventshome] = useState<Event[]>([]);
  const [usersdicionary, setusersdicionary] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (userSession && userSession.token) {
        setuser({
          name: userSession?.token?.name,
          role: userSession?.token?.role as any,
          email: userSession?.token?.email,
          id: userSession?.token?.id,
          created_at: userSession?.token?.created_at,
        });
      }
    };
    fetchData();
  }, [userSession]);

  useEffect(() => {
    const onSubscribe = new EventDB().on(events => {
      setevents(events)
    })
    return onSubscribe;
  }, [])


  useEffect(() => {
    const onSubscribe = new EventDB().on(events => {
      seteventshome(events)
    }, where('status', '==', true))
    return onSubscribe;
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const userDB = new UserDB();
      try {
        const users = await userDB.getAll();
        const usersdict: {[key: string]: any} = {};
        console.log(users);
        users.forEach((user) => {
          usersdict[user.id] = user
         })
         setusersdicionary(usersdict)
      } catch {

      }
    }

    fetchData();
  },[])

  return (
    <DefaultContext.Provider value={{
      user,
      events,
      eventsHome,
      usersdicionary
    }}>
      {children}


    </DefaultContext.Provider>
  );
}