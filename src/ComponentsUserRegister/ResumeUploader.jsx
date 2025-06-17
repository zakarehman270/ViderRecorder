import  { useState } from "react";
import { Controller } from "react-hook-form";
import DangerAlert from "@/Components/DangerAlert";
import PropTypes from "prop-types";

export default function ResumeUploader({
  control,
  errors,
  setFileUploadError,
  fileUploadError
}) {
  const [dragging, setDragging] = useState(false);

  const acceptedFileTypes = [".pdf", ".docx", ".doc"];
  const maxFileSize = 8 * 1024 * 1024; // 8MB

  const validateFile = (file) => {
    setFileUploadError(null);
    if (!file) return "File is required";
    
    const fileTypeValid = acceptedFileTypes.some((type) =>
      file.name.endsWith(type)
    );
    
    if (!fileTypeValid) {
      setFileUploadError("Invalid file type! Only .pdf, .docx, .doc allowed.");
      return "Invalid file type! Only .pdf, .docx, .doc allowed.";
    }
    
    if (file.size > maxFileSize) {
      setFileUploadError("File is too large! Max size is 8MB.");
      return "File is too large! Max size is 8MB.";
    }
    
    return true;
  };

  const handleFileChange = (file) => {
    const validationResult = validateFile(file);
    return validationResult === true ? file : null;
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event, onChange) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    const validatedFile = handleFileChange(droppedFile);
    if (validatedFile) {
      onChange(validatedFile);
    }
  };

  return (
    <div className="">
      <Controller
        name="resume"
        control={control}
        rules={{ required: "Resume is required" }}
        render={({ field: { onChange, value } }) => (
          <label
            htmlFor="fileUpload"
            className={`w-full rounded-lg p-10 cursor-pointer transition flex flex-col items-center
                w-full px-4 py-8 border rounded-md border-gray-300 focus:outline-none focus:ring-2
                ${dragging ? "border-gray-500 bg-gray-100" : "border-gray-300 bg-white"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(event) => handleDrop(event, onChange)}
          >
            <input
              id="fileUpload"
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                const validatedFile = handleFileChange(file);
                if (validatedFile) {
                  onChange(validatedFile);
                }
              }}
            />
            <div className="flex justify-center mb-2">
              <img src="/Upload.svg" alt="upload" className="w-[20px]" />
            </div>
            <p className="text-[#696969] mb-2">
              {value
                ? value.name
                : dragging
                  ? "Drop the file here"
                  : "Click or Drag file to upload"}
            </p>
            <p className="text-xs text-[#696969] mt-1">
              Only .pdf, .docx, .doc, Max upload file size is 8MB
            </p>
          </label>
        )}
      />
      {errors.resume && <DangerAlert message={errors.resume.message} />}
      {fileUploadError && (
        <div className="mt-1">
          <DangerAlert message={fileUploadError} />
        </div>
      )}
    </div>
  );
}
ResumeUploader.propTypes = {
  control: PropTypes.object.isRequired, // often provided by react-hook-form
  errors: PropTypes.object,
  setFileUploadError: PropTypes.func.isRequired,
  fileUploadError: PropTypes.string
};