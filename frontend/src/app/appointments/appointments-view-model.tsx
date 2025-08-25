"use client"
import { useAppointmentsModel } from "./appointments-model";
import AppointmentsView from "./appointments-view";

export const AppointmentsViewModel = () => {
  const methods = useAppointmentsModel()

  return (
    <AppointmentsView {...methods}/>
  )
}

