"use client";
import { useState } from "react";

export const useAppointmentsModel = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(); 
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime
  };
};
