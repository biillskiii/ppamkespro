import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Table = ({ columns = [], data = [], type }) => {
  "Table Data:", data; // Debugging

  const rowsPerPage = 7;
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

  const questionRow = data[0]; // Assume the first row contains the questions

  return (
    <div className="overflow-x-auto relative h-auto sm:rounded-lg">
      <table className="w-9/12 mx-auto my-20 text-sm text-gray-500 border-collapse border border-gray-200">
        {/* Render the questions in thead */}
        <thead>
          <tr className="bg-accent text-xs text-white uppercase">
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`py-3 px-6 border border-gray-300 ${
                  column.header === "question" ? "w-7/12" : ""
                }`}
              >
                {questionRow[column.header]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getPagedData().length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-4 px-6 text-center border border-gray-300"
              >
                No data available
              </td>
            </tr>
          ) : (
            getPagedData()
              .filter((row) =>
                columns.every(
                  (column) =>
                    row[column.accessor] !== "" &&
                    row[column.accessor] !== undefined
                )
              )
              .map((row, index) => (
                <tr key={index} className="bg-white">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`py-4 px-6 border border-gray-200 ${getColorClass(
                        row[column.accessor]
                      )}`}
                    >
                      {row[column.accessor] || ""}
                    </td>
                  ))}
                </tr>
              ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex mb-20 flex-wrap justify-center items-center mt-4 space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            <IoIosArrowBack size={20} />
          </button>

          {/* Page Number Buttons */}
          {visiblePageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3.5 py-1.5 border border-gray-300 rounded ${
                currentPage === number
                  ? "bg-accent text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-accent hover:text-white`}
            >
              {number}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            <IoIosArrowForward size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
