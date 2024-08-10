"use client";
import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { id } from "date-fns/locale";
import { FaCalendarAlt } from "react-icons/fa";

const DatePicker = () => {
  // Inisialisasi selectedDate dari localStorage
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const savedDate = localStorage.getItem("selectedDate");
    return savedDate ? new Date(savedDate) : null;
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const toggleDatepicker = () => {
    setShowDatepicker(!showDatepicker);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateSelect = (date) => {
    // Simpan tanggal yang dipilih ke localStorage tanpa menggunakan toISOString
    const localDate = format(date, "yyyy-MM-dd");
    setSelectedDate(date);
    setShowDatepicker(false);
    localStorage.setItem("selectedDate", localDate);
  };
  const renderDays = () => {
    const days = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
    return days.map((day) => (
      <div key={day} className="text-center text-xs font-bold text-gray-600">
        {day}
      </div>
    ));
  };

  const renderDates = () => {
    const startDate = startOfWeek(startOfMonth(currentMonth), {
      weekStartsOn: 0,
    });
    const endDate = endOfMonth(currentMonth);
    const dates = [];
    let date = startDate;

    while (date <= endDate || isSameMonth(date, currentMonth)) {
      dates.push(date);
      date = addDays(date, 1);
    }

    return dates.map((date) => {
      const isSunday = getDay(date) === 0;
      return (
        <div
          key={date.toString()}
          className={`p-2 rounded-lg cursor-pointer ${
            !isSameMonth(date, currentMonth)
              ? "text-gray-400"
              : isSameDay(date, selectedDate)
              ? "bg-blue-500 text-white"
              : isSunday
              ? "text-red-500"
              : "text-gray-900 hover:bg-gray-200"
          }`}
          onClick={() =>
            isSameMonth(date, currentMonth) && handleDateSelect(date)
          }
        >
          {format(date, "d")}
        </div>
      );
    });
  };

  return (
    <div className="relative inline-block">
      <label htmlFor="date-picker-input" className="block mb-2">
        <div>
          Tanggal Penilaian <span></span>
        </div>
      </label>
      <div className="relative">
        <input
          type="text"
          id="date-picker-input"
          placeholder="Pilih tanggal"
          className="w-full pl-3 cursor-pointer pr-4 py-2 border border-border rounded-md"
          readOnly
          value={
            selectedDate
              ? format(selectedDate, "dd-MMMM-yyyy", { locale: id })
              : ""
          }
          onClick={toggleDatepicker}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <FaCalendarAlt />
        </div>
      </div>
      {showDatepicker && (
        <div className="datepicker absolute top-20 left-0 w-96 p-4 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="flex justify-between items-center mb-4">
            <button className="text-xl text-gray-700" onClick={handlePrevMonth}>
              &laquo;
            </button>
            <span className="font-bold text-gray-900">
              {format(currentMonth, "MMMM yyyy", { locale: id })}
            </span>
            <button className="text-xl text-gray-700" onClick={handleNextMonth}>
              &raquo;
            </button>
          </div>
          <div className="grid grid-cols-7 text-center mb-2">
            {renderDays()}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {renderDates()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
