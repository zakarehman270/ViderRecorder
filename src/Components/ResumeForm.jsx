import  { useState, useEffect } from "react";
import Select from "react-select";
import { useAddUserProfileMutation } from "../redux/api/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Trash, Plus } from "lucide-react";
import PropTypes from "prop-types";
// Define initial form structure based on new data
const initialFormState = {
  "Full Name": "",
  Address: "",
  "Phone Number": "",
  Email: "",
  Skills: [],
  Links: [{ name: "", link: "" }],
  Projects: [{ name: "", description: "" }],
  "Work Experience": {
    "Total Years of Experience": "",
    Entries: [
      {
        "Company Name": "",
        "Job Role": "",
        "Tools Used": [],
        start_date: "",
        end_date: "",
      },
    ],
  },
  Education: [
    { "Institution Name": "", Degree: "", start_date: "", end_date: "" },
  ],
};

const SideModal = ({ isOpen, onClose, initialData, setFinalResumeData }) => {
  const navigate = useNavigate();
  const [createProfile] = useAddUserProfileMutation();
  const [formData, setFormData] = useState({
    ...initialFormState,
    ...initialData,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...initialFormState, ...initialData });
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    setFinalResumeData(formData);
  }, [formData]);

  const handleClose = () => {
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleChange = (e, index, section) => {
    const { name, value } = e.target;

    if (section) {
      if (section === "Links") {
        const updatedLinks = formData.Links.map((link, i) =>
          i === index ? { ...link, [name]: value } : link
        );
        setFormData({
          ...formData,
          Links: updatedLinks,
        });
      } else if (section === "Projects") {
        const updatedProjects = formData.Projects.map((project, i) =>
          i === index ? { ...project, [name]: value } : project
        );
        setFormData({
          ...formData,
          Projects: updatedProjects,
        });
      } else if (section === "Education") {
        const updatedEducation = formData.Education.map((education, i) =>
          i === index ? { ...education, [name]: value } : education
        );
        setFormData({
          ...formData,
          Education: updatedEducation,
        });
      } else if (section === "Work Experience.Entries") {
        const updatedEntries = formData["Work Experience"].Entries.map(
          (entry, i) => (i === index ? { ...entry, [name]: value } : entry)
        );
        setFormData({
          ...formData,
          "Work Experience": {
            ...formData["Work Experience"],
            Entries: updatedEntries,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleMultiSelectChange = (selectedOptions, action) => {
    const { name } = action;
    setFormData({
      ...formData,
      [name]: selectedOptions.map((option) => option.value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginPromise = createProfile(formData).unwrap();
    toast.promise(loginPromise, {
      loading: "Loading...",
      success: (response) => {
        if (response?.statusCode === 200) {
          handleClose();
          navigate("/videoRecorder");
          return `${response?.message}`;
        }
      },
      error: (error) => {
        return error?.data?.message || "Error occurred during Profile Creation";
      },
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      Projects: [...formData.Projects, { name: "", description: "" }],
    });
  };

  const removeProject = (index) => {
    const updatedProjects = formData.Projects.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      Projects: updatedProjects,
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      Education: [
        ...formData.Education,
        { "Institution Name": "", Degree: "", start_date: "", end_date: "" },
      ],
    });
  };

  const removeEducation = (index) => {
    const updatedEducation = formData.Education.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      Education: updatedEducation,
    });
  };

  const transformToOptions = (values) => {
    return values.map((value) => ({ value, label: value }));
  };

  return (
    <>
      <div className="flex justify-center items-center">

        <div className="bg-white pb-5 w-full max-w-5xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Email */}
            <div className="flex outerWrapperFormFields gap-4">
              <div className="w-1/2 fullWidthInMobile">
                <label className="block text-lg font-medium text-[black]">
                  Full Name 
                </label>
                <input
                  type="text"
                  name="Full Name"
                  value={formData["Full Name"]}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                />
              </div>
              <div className="w-1/2 fullWidthInMobile">
                <label className="block text-lg font-medium text-[black]">
                  Email
                </label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                />
              </div>
            </div>

            {/* Address & Phone Number */}
            <div className="flex outerWrapperFormFields gap-4">
              <div className="w-1/2 fullWidthInMobile">
                <label className="block text-lg font-medium text-[black]">
                  Address
                </label>
                <input
                  type="text"
                  name="Address"
                  value={formData.Address}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                />
              </div>
              <div className="w-1/2 fullWidthInMobile">
                <label className="block text-lg font-medium text-[black]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="Phone Number"
                  value={formData["Phone Number"]}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-lg font-medium text-[black]">
                Skills
              </label>
              <Select
                isMulti
                name="Skills"
                options={transformToOptions(formData.Skills)} // Use formData.Skills as options
                value={transformToOptions(formData.Skills)} // Use formData.Skills as selected values
                onChange={handleMultiSelectChange}
                className="mt-1"
              />
            </div>
            {/* Projects */}
            <div>
              <div className="flex justify-between mt-2 itmes-center">
                <label className="block text-lg font-medium text-[black]">
                  Projects
                </label>
                <Plus
                  className="text-[#176a66] cursor-pointer"
                  onClick={addProject}
                />
              </div>

              {formData.Projects.map((project, index) => (
                <div key={index} className="mt-2">
                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor=""
                    >
                      Project Name
                    </label>
                    <input
                      type="text"
                      name="name" // Ensure this matches the property name in the object
                      value={project.name}
                      onChange={(e) => handleChange(e, index, "Projects")} // Pass the correct section
                      placeholder="Project Name"
                      className="w-full px-4 mt-2 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor=""
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={project.description}
                      onChange={(e) => handleChange(e, index, "Projects")}
                      placeholder="Project Description"
                      className="w-full mt-2 px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                    />
                  </div>
                  <Trash
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeProject(index)}
                  />
                </div>
              ))}
            </div>
            {/* Education */}
            <div>
              <div>

              </div>
              <div className="flex justify-between mt-2 itmes-center">
                <label className="block text-lg font-medium text-[black]">
                  Education
                </label>
                <Plus
                  className="text-[#176a66] cursor-pointer"
                  onClick={addEducation}
                />
              </div>

              {formData.Education.map((education, index) => (
                <div key={index} className="mt-2">
                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor=""
                    >
                      Institution Name
                    </label>
                    <input
                      type="text"
                      name="Institution Name"
                      value={education["Institution Name"]}
                      onChange={(e) => handleChange(e, index, "Education")}
                      placeholder="Institution Name"
                      className="w-full px-4 mt-2  py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                    />
                  </div>

                  <div className="mb-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor=""
                    >
                      Degree Name
                    </label>
                    <input
                      type="text"
                      name="Degree"
                      value={education.Degree}
                      onChange={(e) => handleChange(e, index, "Education")}
                      placeholder="Degree"
                      className="w-full mt-2 px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                    />
                  </div>

                  <div className="flex gap-2 mb-2">
                    <div className="w-full ">
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor=""
                      >
                        Start Date
                      </label>
                      <input
                        type="text"
                        name="start_date"
                        value={education.start_date}
                        onChange={(e) => handleChange(e, index, "Education")}
                        placeholder="Start Date"
                        className="w-full mt-2 px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                      />
                    </div>
                    <div className="w-full">
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor=""
                      >
                        End Date
                      </label>
                      <input
                        type="text"
                        name="end_date"
                        value={education.end_date}
                        onChange={(e) => handleChange(e, index, "Education")}
                        placeholder="End Date"
                        className="w-full mt-2 px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                      />
                    </div>
                  </div>

                  <Trash
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeEducation(index)}
                  />
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>
    </>

  );
};

SideModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object, // or PropTypes.shape({...}) for a stricter check
  setFinalResumeData: PropTypes.func.isRequired,
};


export default SideModal;
