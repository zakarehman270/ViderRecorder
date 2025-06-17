// hooks/useResumeProcessing.js
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetResumeDetailsMutation,
  usePostPythonItemsMutation,
  EditResumeDetailsData,      // <-- add this
  UpdateResumeDetailsData 
} from "@/redux/api/apiPython";
import axios from "axios";

export function useResumeProcessing(videoId) {
  const [resumeData, setResumeData] = useState(null);
  const [finalResumeData, setFinalResumeData] = useState(null);
  const [resumeDetailsData, setResumeDetailsData] = useState(null);
  const [resumeScoreData, setResumeScoreData] = useState(null);
  
  const [extractDetails, { isLoading }] = usePostPythonItemsMutation();
  const [getResumeDetails, { isLoading: isResumeLoading }] = useGetResumeDetailsMutation();

  const processResumeFile = async (resumeFile) => {
    setResumeDetailsData(null);
    
    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("custom_criteria", "");
    
    try {
      const response = await extractDetails(formData).unwrap();
      setResumeData(response.data?.resume_details);
      
      await analyzeVideo(videoId);
      
      return response;
    } catch (error) {
      console.error("Error processing resume:", error);
      toast.error("Failed to process resume");
    }
  };

  const analyzeVideo = async (videoId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_PYTHON_URL}analyze_video/?video_url=${import.meta.env.VITE_SERVER_URL}/video/${videoId}`, 
        null,
        { withCredentials: true }
      );
      
      const getResumeDetailsResponse = await getResumeDetails().unwrap();
      setResumeDetailsData(getResumeDetailsResponse?.evaluation_results);
    } catch (error) {
      console.error("Error analyzing video:", error);
    }
  };

  const updateResumeDetails = async ({ 
    location, 
    userData, 
    selectedID, 
    resumeDetailsData, 
    setLoadingSubmitResume, 
    navigate 
  }) => {
    try {
      let result;
      const userId = userData?.user?.id;
      
      if (location?.search?.includes("edit")) {
        if (selectedID) {
          result = await EditResumeDetailsData({
            data: { evaluation_score: resumeDetailsData },
            userID: selectedID,
          }).unwrap();
        }
      } else if (location?.search?.includes("New")) {
        if (selectedID) {
          result = await UpdateResumeDetailsData({
            userID: selectedID,
            evaluation_score: resumeDetailsData
          }).unwrap();
        }
      } else {
        if (userId) {
          result = await UpdateResumeDetailsData({
            userID: userId,
            evaluation_score: resumeDetailsData
          }).unwrap();
        }
      }
      
      if (result) {
        setLoadingSubmitResume(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error updating resume data:", error);
      setLoadingSubmitResume(false);
    }
  };

  return {
    resumeData,
    finalResumeData,
    resumeDetailsData,
    resumeScoreData,
    isLoading,
    isResumeLoading,
    setResumeData,
    setFinalResumeData,
    setResumeDetailsData,
    setResumeScoreData,
    processResumeFile,
    updateResumeDetails
  };
}