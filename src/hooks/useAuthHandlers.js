// hooks/useAuthHandlers.js
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { UpdateSelectedProfile } from "@/redux/Slices/SelectedProfile";
import {
  useCheckExistingUserMutation,
  useCreateProfileMutation,
  useEditUserProfileMutation,
  useEditUserSubProfileMutation,
  useLogInMutation,
  useNewSubProfileMutation,
  useUploadResumeMutation,
} from "@/redux/api/api";

export function useAuthHandlers({
  userData,
  getValues,
  navigate,
  finalResumeData,
  resumeScoreData,
  videoId,
  setLoadingSubmitResume,
  setNavigateNextPage,
  selectedID
}) {
  const dispatch = useDispatch();
  const [login] = useLogInMutation();
  const [checkExistingUser] = useCheckExistingUserMutation();
  const [createProfile] = useCreateProfileMutation();
  const [uploadResume] = useUploadResumeMutation();
  const [EditUserProfile] = useEditUserProfileMutation();
  const [NewSubProfile] = useNewSubProfileMutation();
  const [updateUserSubProfile] = useEditUserSubProfileMutation();
  
  const SelectID = selectedID?.parentID ? selectedID.parentID : selectedID?.id;

  const handleLogin = async () => {
    const formDataAllValues = getValues();
    try {
      const response = await login({
        email: formDataAllValues?.email,
        password: formDataAllValues?.password,
      }).unwrap();
      
      localStorage.setItem(
        "AuthUser",
        JSON.stringify({
          accessToken: response?.AccessToken,
          user: response?.user,
        })
      );
      
      localStorage.setItem(
        "SelectedProfile",
        JSON.stringify({
          id: response?.user?.id,
          parentID: ""
        })
      );
      
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const createNewProfile = async () => {
    setLoadingSubmitResume(true);
    setNavigateNextPage(null);
    const formDataAllValues = getValues();
    const location = window.location;
    
    try {
      if (location?.search?.includes("New")) {
        await createNewSubProfile(formDataAllValues);
      }
      else if (location?.search?.includes("edit")) {
        await updateExistingProfile(formDataAllValues);
      }
      else {
        await createBrandNewProfile(formDataAllValues);
      }
    } catch (error) {
      console.error("Profile creation failed:", error);
      setLoadingSubmitResume(false);
      toast.error("Failed to create profile");
    }
  };

  const createNewSubProfile = async (formDataAllValues) => {
    const response = await NewSubProfile({
      userID: userData?.user?.id,
      profile: finalResumeData,
      evaluation_score: resumeScoreData,
      videoId: videoId
    });
    
    const ResumeFile = new FormData();
    ResumeFile.append("resume", formDataAllValues?.resume);
    
    try {
      await uploadResume({
        file: ResumeFile,
        userID: response?.data?.data?.userSubProfileID,
      }).unwrap();
      
      localStorage.setItem(
        "NewUserSubProfileID",
        JSON.stringify({
          id: response?.data?.data?.userSubProfileID,
        })
      );
      
      localStorage.setItem(
        "SelectedProfile",
        JSON.stringify({
          id: userData?.user?.id,
          parentID: response?.data?.data?.userSubProfileID,
        })
      );
      
      dispatch(
        UpdateSelectedProfile({
          parentID: response?.data?.data?.userSubProfileID,
          id: userData?.user?.id,
        })
      );
      
      setNavigateNextPage(true);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const updateExistingProfile = async (formDataAllValues) => {
    if (selectedID?.parentID) {
      await updateUserSubProfile({
        data: {
          email: userData?.user?.email,
          profile: finalResumeData,
        },
        id: userData?.user?.id,
        parentID: SelectID,
      });
    } else {
      await EditUserProfile({
        data: {
          email: userData?.user?.email,
          profile: finalResumeData,
        },
        id: SelectID,
      });
    }
    
    const ResumeFile = new FormData();
    ResumeFile.append("resume", formDataAllValues?.resume);
    
    try {
      await uploadResume({
        file: ResumeFile,
        userID: userData?.user?.id,
      }).unwrap();
      
      setNavigateNextPage(true);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const createBrandNewProfile = async (formDataAllValues) => {
    const response = await createProfile({
      email: formDataAllValues?.email,
      password: formDataAllValues?.password,
      profile: finalResumeData,
      evaluation_score: resumeScoreData,
      videoId: videoId
    });
    
    const ResumeFile = new FormData();
    ResumeFile.append("resume", formDataAllValues?.resume);
    
    try {
      await uploadResume({
        file: ResumeFile,
        userID: response?.data?.user?.id,
      }).unwrap();
      
      localStorage.setItem(
        "AuthUser",
        JSON.stringify({
          accessToken: response?.data?.accessToken,
          user: response?.data?.user,
        })
      );
      
      localStorage.setItem(
        "SelectedProfile",
        JSON.stringify({
          id: response?.data?.user?.id,
          parentID: "",
        })
      );
      
      setNavigateNextPage(true);
      
      dispatch(
        UpdateSelectedProfile({
          parentID: "",
          id: response?.data?.user?.id,
        })
      );
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return {
    handleLogin,
    createNewProfile,
    checkExistingUser
  };
}