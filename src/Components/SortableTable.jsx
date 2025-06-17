import { useState } from "react";
import DeactivateModal from "./VideoModal";
import LogoutModal from "./LogoutModal";
import { toast } from "sonner";
import { useLazyGetSubProfileQuery } from "@/redux/api/api";
import SideModal from "./SideModal";
import { Eye, User } from "lucide-react";
import PropTypes from "prop-types";

const SortableTable = ({
  getUsers,
  currentPage,
  setCurrentPage,
  usersPerPage,
  handleFetchUsers,
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [searchInput, setSearchInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [ProfileData, setProfileData] = useState(null);
  const [trigger, { data: getSubProfile }] = useLazyGetSubProfileQuery();

  const sortableFields = ["name", "email", "primaryRole"];

  const sortedUsers = [...(getUsers?.data || [])].sort((a, b) => {
    const key = sortConfig.key;
    if (sortableFields.includes(key)) {
      const valueA = a[key]?.toString().trim().toLowerCase() || "";
      const valueB = b[key]?.toString().trim().toLowerCase() || "";

      if (valueA < valueB) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const handleSort = (key) => {
    if (!sortableFields.includes(key)) {
      return;
    }

    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 0 && value.length < 2) {
      setErrorMessage("Type minimum 2 characters");
    } else {
      setErrorMessage("");
      handleFetchUsers(1, value);
    }
  };
  const currentUsers = sortedUsers;
  const totalPages = Math.ceil(getUsers?.pagination?.total / usersPerPage);

  const handleNext = () => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + 1;
      handleFetchUsers(newPage);
      return newPage;
    });
  };

  const handlePrevious = () => {
    setCurrentPage((prevPage) => {
      if (prevPage > 1) {
        const newPage = prevPage - 1;
        handleFetchUsers(newPage);
        return newPage;
      }
      return prevPage;
    });
  };

  const columnKeyMap = {
    Name: "name",
    Email: "email",
    "Primary Role": "primaryRole",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    const toastId = toast.loading("Deleting user...");

    try {
      handleFetchUsers(1, "");
      setIsModalOpen(false);
      setCurrentPage(1);
    } catch (error) {
      toast.update(toastId, {
        render: error?.data?.message || "Failed to delete user.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  function handleGetSubprofile(userId, subprofileID) {
    trigger({ userID: userId, subprofile: subprofileID });
    setProfileData(null);
    setIsOpen(true);
  }


  console.log("currentUsers", currentUsers)
  return (
    <div className="overflow-x-auto bg-white p-6 rounded-2xl shadow-md">
      {isModalOpen && (
        <LogoutModal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleLogout}
          message={"Would you like to delete this user?"}
        />
      )}
      {isOpen && (
        <SideModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          userData={ProfileData ? ProfileData : getSubProfile?.data}
        />
      )}

      <div className="flex items-center  justify-between mb-3 align-center">
        <h2 className="text-2xl font-bold mb-4">User Profile List</h2>
        <div>
          <input
            type="text"
            placeholder="Search by Stack"
            className={`w-full border rounded-[10px] h-[50px] p-2 transition-all
              focus:border-green-500 focus:ring-2 focus:ring-[#176a66] focus:outline-none ${
                errorMessage ? "border-red-500" : ""
              }`}
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
      </div>
      <div className="">
        <table className="min-w-full shadow-md border border-gray-200 border-separate border-spacing-0 rounded-2xl overflow-hidden">
          <thead className="bg-[#176A66] text-white">
            <tr>
              {[
                "Image",
                "Name",
                "Total Work Experience",
                "Email",
                "Score",
                "Stack",
                "Video",
                "Resume",
                "SubProfiles",
                "View Details",
              ].map((key) => {
                const sortKey = columnKeyMap[key];
                return (
                  <th
                    key={key}
                    className="p-4 text-left cursor-pointer"
                    onClick={() => handleSort(sortKey)}
                  >
                    <div className="flex items-center">
                      {key}
                      {sortConfig.key === sortKey &&
                        (sortConfig.direction === "asc" ? (
                          <span className="ml-1">▲</span>
                        ) : (
                          <span className="ml-1">▼</span>
                        ))}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr
                  key={index}
                  className={`border-t ${
                    index % 2 === 0 ? "bg-gray-50" : ""
                  } hover:bg-[#EDEDED] `}
                >
                  <td className="p-2 text-sm		">
                    <img
                      src={user.image ? user.image : "/user.png"}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="p-2 text-sm		">{user.fullName}</td>
                  <td className="p-2 text-sm		">
                    {user.workExperience?.totalYearsOfExperience}
                  </td>
                  <td className="p-2 text-sm		">{user.email}</td>
                  <td className="p-2 text-sm		">
                    {user.resumeDetails?.evaluation_score?.final_score ||
                      "N/A"}
                  </td>
                  <td className="p-2 text-sm		">{user.title || "N/A"}</td>
                  <td className="p-2 text-sm		">
                    <DeactivateModal
                      url={
                        import.meta.env.VITE_SERVER_URL +
                        "/video/" +
                        user?.videoId
                      }
                    />
                  </td>
                  <td className="p-2 text-sm		">
                    {user?.userID ? (
                      <a
                        title={
                          import.meta.env.VITE_SERVER_URL +
                          "/get-resume?userId=" +
                          user?.userID
                        }
                        href={
                          import.meta.env.VITE_SERVER_URL +
                          "/get-resume?userId=" +
                          user?.userID
                        }
                        target={"_blank"}
                        rel="noopener noreferrer"
                        className="text-[#176A66] font-bold underline"
                      >
                        Download
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-2 text-sm flex items-center gap-2">
                    {user?.SubProfileIDs.length > 0
                      ? user?.SubProfileIDs.map((items, index) => {
                          return (
                            <p key={index} className="">
                              <User
                                className="cursor-pointer w-5 h-5 text-[#176A66]"
                                onClick={() =>
                                  handleGetSubprofile(user?.userID, items)
                                }
                              />
                            </p>
                          );
                        })
                      : "N/A"}
                  </td>
                  <td className="p-2 text-sm		">
                    <Eye
                      className="cursor-pointer w-6 h-9"
                      onClick={() => {
                        setIsOpen(true);
                        setProfileData(user);
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-2 text-sm		 text-center">
                  Not Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {getUsers?.pagination?.total > 10 && (
        <div className="flex justify-end items-center mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => {
                setCurrentPage(i + 1);
                handleFetchUsers(i + 1); // Fetch users for the selected page
              }}
              className={`px-3 py-1 mx-1 border rounded-md ${
                currentPage === i + 1
                  ? "bg-[#4eb7b2] text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 mx-1 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

SortableTable.propTypes = {
  getUsers: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  usersPerPage: PropTypes.number.isRequired,
  handleFetchUsers: PropTypes.func.isRequired,
};
export default SortableTable;
