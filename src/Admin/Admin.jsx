import SortableTable from "@/Components/SortableTable";
import { useLazyGetUserProfileByAdminQuery } from "@/redux/api/api";
import  { useEffect, useState } from "react";
import { Book, GraduationCap, Users } from "lucide-react";
import { BarChart } from "lucide-react";

const AdminPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
  const [fetchQuestions, { data: userProfile, isLoading }] = useLazyGetUserProfileByAdminQuery();

  useEffect(() => {
    fetchQuestions({ pageNumber: 1, pagelimit: 10 });
  }, []);

  const handleFetchUsers = (currentPage,value ) => {
    fetchQuestions({ pageNumber : currentPage, pagelimit:10 ,Search:value });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 mb-4  lg:grid-cols-4 gap-4">
          <div className="p-4 flex items-center bg-white shadow-md rounded-lg">
            <Book className="text-blue-500 text-2xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold">155+</h3>
              <p className="text-gray-500">Completed Courses</p>
            </div>
          </div>
          <div className="p-4 flex items-center bg-white shadow-md rounded-lg">
            <GraduationCap className="text-green-500 text-2xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold">39+</h3>
              <p className="text-gray-500">Earned Certificates</p>
            </div>
          </div>
          <div className="p-4 flex items-center bg-white shadow-md rounded-lg">
            <BarChart className="text-purple-500 text-2xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold">25+</h3>
              <p className="text-gray-500">Courses in Progress</p>
            </div>
          </div>
          <div className="p-4 flex items-center bg-white shadow-md rounded-lg">
            <Users className="text-orange-500 text-2xl mr-4" />
            <div>
              <h3 className="text-lg font-semibold">18k+</h3>
              <p className="text-gray-500">Community Support</p>
            </div>
          </div>
        </div>
        {userProfile && <SortableTable  
                getUsers={userProfile}
                handleFetchUsers={handleFetchUsers}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                usersPerPage={usersPerPage}
                isLoading={isLoading} />}
      </main>
   
    </div>
  );
};

export default AdminPage;