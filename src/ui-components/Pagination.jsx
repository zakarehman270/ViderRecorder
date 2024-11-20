import React from "react";
import { Button, Icon } from "../ui-components";
const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-4">
      <ul className="inline-flex items-center space-x-2">
        {/* Previous Button */}
        <li>
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
           <Icon name={"arrow-left-s-line"} />
          </Button>
        </li>

        {/* Page Numbers */}
        {getPageNumbers().map((page) => (
          <li key={page}>
            <Button
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </Button>
          </li>
        ))}

        {/* Ellipsis */}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <li className="text-gray-700">...</li>
        )}

        {/* Next Button */}
        <li>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
             <Icon name={"arrow-right-s-line"}  />
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
