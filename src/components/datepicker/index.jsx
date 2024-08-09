"use client";
import { useState } from "react";
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
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
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
    setSelectedDate(date);
    setShowDatepicker(false);
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
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.72539 1.875C7.07057 1.875 7.35039 2.15482 7.35039 2.5V2.70379C7.38492 2.69489 7.41956 2.68627 7.45431 2.67793C9.12887 2.27593 10.8718 2.27593 12.5463 2.67793C12.5811 2.68627 12.6157 2.69489 12.6503 2.70379V2.5C12.6503 2.15482 12.9301 1.875 13.2753 1.875C13.6204 1.875 13.9003 2.15482 13.9003 2.5V3.16823C15.6549 4.03603 16.9612 5.67409 17.4151 7.65473C17.8065 9.36227 17.8065 11.1392 17.4151 12.8467C16.8508 15.309 14.9692 17.2419 12.5463 17.8235C10.8718 18.2255 9.12887 18.2255 7.45431 17.8235C5.03149 17.2419 3.14988 15.309 2.58552 12.8467C2.19415 11.1392 2.19415 9.36227 2.58552 7.65473C3.03948 5.67409 4.34573 4.03603 6.10039 3.16823V2.5C6.10039 2.15482 6.38021 1.875 6.72539 1.875ZM6.1005 4.60643C5.45013 5.03369 4.8973 5.60303 4.4832 6.27405H15.5175C15.1033 5.60303 14.5505 5.03368 13.9002 4.60643C13.8939 4.94623 13.6165 5.21979 13.2753 5.21979C12.9301 5.21979 12.6503 4.93997 12.6503 4.59479V4.00513C12.5205 3.96286 12.3885 3.92555 12.2546 3.89339C10.7718 3.53744 9.22886 3.53744 7.7461 3.89339C7.61216 3.92555 7.48018 3.96287 7.35039 4.00513V4.59479C7.35039 4.93997 7.07057 5.21979 6.72539 5.21979C6.3841 5.21979 6.10671 4.94624 6.1005 4.60643ZM16.0862 7.52405H3.91449C3.87268 7.65841 3.83575 7.79512 3.80392 7.93399C3.45468 9.45774 3.45468 11.0437 3.80392 12.5674C4.26507 14.5794 5.79705 16.1401 7.7461 16.608C9.22886 16.964 10.7718 16.964 12.2546 16.608C14.2036 16.1401 15.7356 14.5794 16.1967 12.5674C16.546 11.0437 16.546 9.45774 16.1967 7.93399C16.1649 7.79513 16.128 7.65841 16.0862 7.52405Z"
              fill="#161616"
            />
            <path
              d="M11.2016 11.6035C11.5391 11.3635 11.7491 11.0035 11.7491 10.516C11.7491 9.50352 10.9691 8.97852 10.0466 8.97852C9.12406 8.97852 8.33656 9.50352 8.33656 10.516C8.33656 11.0035 8.55406 11.3635 8.88406 11.6035C8.42656 11.881 8.16406 12.3385 8.16406 12.871C8.16406 13.8385 8.87656 14.4385 10.0466 14.4385C11.2091 14.4385 11.9291 13.8385 11.9291 12.871C11.9291 12.3385 11.6666 11.881 11.2016 11.6035ZM10.0466 9.95352C10.4366 9.95352 10.7216 10.1785 10.7216 10.5685C10.7216 10.951 10.4366 11.191 10.0466 11.191C9.65656 11.191 9.37156 10.951 9.37156 10.5685C9.37156 10.1785 9.65656 9.95352 10.0466 9.95352ZM10.0466 13.4635C9.55156 13.4635 9.19156 13.2085 9.19156 12.736C9.19156 12.271 9.55156 12.016 10.0466 12.016C10.5416 12.016 10.9016 12.271 10.9016 12.736C10.9016 13.2085 10.5416 13.4635 10.0466 13.4635Z"
              fill="#161616"
            />
          </svg>
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
