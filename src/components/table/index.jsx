import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Table = ({ columns = [], data = [], type }) => {
  "Table Data:", data; // Debugging

  const rowsPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);

  // Function to get the current page's data
  const getPagedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getColorClass = (value) => {
    const stringValue = String(value).toLowerCase();
    switch (stringValue) {
      case "ideal":
      case "ya":
        return "text-green-500";
      case "minimal diperlukan":
      case "tidak":
        return "text-red-500";
      case "tidak memadai":
      case "tidak tahu":
        return "text-gray-500";
      default:
        return "";
    }
  };

  if (!Array.isArray(data)) {
    console.error("Invalid data format:", data);
    return <p>Error: Invalid data format</p>;
  }

  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Calculate the range of page numbers to display
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const getVisiblePageNumbers = () => {
    const maxButtons = 5;
    const halfRange = Math.floor(maxButtons / 2);

    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, currentPage + halfRange);

    // Adjust the start and end if there are not enough pages before or after the current page
    if (end - start + 1 < maxButtons) {
      if (start === 1) {
        end = Math.min(maxButtons, totalPages);
      } else if (end === totalPages) {
        start = Math.max(1, totalPages - maxButtons + 1);
      }
    }

    return pageNumbers.slice(start - 1, end);
  };

  const visiblePageNumbers = getVisiblePageNumbers();
  const adjustedColumns = type === "sub" ? [...columns] : columns;
  return (
    <div className="overflow-x-auto relative h-auto sm:rounded-lg">
      <table className="w-9/12 mx-auto mt-20 text-sm text-gray-500 border-collapse border border-gray-200 no-select">
        <thead className="text-xs text-white uppercase bg-accent">
          <tr>
            {adjustedColumns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`py-3 px-6 border border-gray-300 ${
                  column.accessor === "question" ? "w-7/12" : ""
                } ${column.accessor === "value" ? "w-52 text-center" : ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getPagedData().length === 0 ? (
            <tr>
              <td
                colSpan={adjustedColumns.length}
                className="py-4 px-6 text-center border border-gray-300"
              >
                No data available
              </td>
            </tr>
          ) : (
            getPagedData().map((row, index) => (
              <tr key={index} className="bg-white">
                {adjustedColumns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`py-4 px-6 border border-gray-200 ${getColorClass(
                      row[column.accessor]
                    )} ${column.accessor === "value" ? "font-semibold" : ""}`}
                  >
                    {row[column.accessor] || "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
