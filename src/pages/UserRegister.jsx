import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingButton from "../Components/LoadingButton";
import SideModal from "@/Components/ResumeForm";
import VideoRecording from "@/Components/VideoRecording";
import { Eye, EyeOff } from "lucide-react"; // Import icons
import { toast } from "sonner";
import {
  useCheckExistingUserMutation,
  useCreateProfileMutation,
  useEditUserProfileMutation,
  useEditUserSubProfileMutation,
  useLogInMutation,
  useNewSubProfileMutation,
  useUploadResumeMutation,
} from "@/redux/api/api";
import DangerAlert from "@/Components/DangerAlert";
import {
  useEvaluateResumeMutation,
  usePostPythonItemsMutation,
} from "@/redux/api/apiPython";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UpdateSelectedProfile } from "@/redux/Slices/SelectedProfile";
import { setSessionId } from "@/redux/Slices/sessionSlice";
import axios from "axios";

export default function UserRegister({ StartSpeaks, stopAudio }) {
  const [checkExistingUser] = useCheckExistingUserMutation();
  const [extractDetails, { isLoading }] = usePostPythonItemsMutation();

  const [evaluateResume] = useEvaluateResumeMutation();

  const [login] = useLogInMutation();
  const [createProfile] = useCreateProfileMutation();
  const [uploadResume] = useUploadResumeMutation();
  const [EditUserProfile] = useEditUserProfileMutation();
  const [NewSubProfile] = useNewSubProfileMutation();
  const [updateUserSubProfile] = useEditUserSubProfileMutation();

  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [ResumeData, setResumeData] = useState(null);
  const [FinalResumeData, setFinalResumeData] = useState(null);

  const [LoadingSubmitResume, setLoadingSubmitResume] = useState(null);
  const [VideId, setVideoID] = useState(null);

  const dispatch = useDispatch();

  const localtion = useLocation();
  const selectedID = useSelector((state) => state.profile.selectedProfile);
  const SelectID = selectedID?.parentID ? selectedID.parentID : selectedID?.id;
  const userData = JSON.parse(localStorage.getItem("AuthUser"));

  useEffect(() => {
    if (
      localtion?.search?.includes("edit") ||
      localtion?.search?.includes("New")
    ) {
      setCurrentStep(2);
    }
  }, []);

  const [previewUrl, setPreviewUrl] = useState(null);

  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    watch,
  } = useForm({
    mode: "onChange",
  });

  const stepMessages = useMemo(
    () => [
      {
        label: "Email",
        message:
          "Okay, great! Now, enter your email to check if you are an existing user or not.",
        isDisplaying: true,
      },
      {
        label: "Already Registered",
        message:
          "This user is already registered. Please log in to see your dashboard.",
        isDisplaying: isUserRegistered,
      },
      {
        label: "Password",
        message: "Enter your password",
        isDisplaying: true,
      },
      {
        label: "Record Introduction Video",
        message: "Record your introduction video to continue your profile.",
        isDisplaying: true,
      },
      {
        label: "Upload Resume",
        message: location?.search?.includes("edit")
          ? "Good to see you here! Please upload your resume to edit your profile."
          : "Good to see you here! Please upload your resume.",
        isDisplaying: true,
      },
      {
        label: "Check Resume Data",
        message: "Please check the uploaded resume form",
        isDisplaying: true,
      },
    ],
    [isUserRegistered]
  );

  const displayedSteps = stepMessages.filter((step) => step.isDisplaying);

  const steps = displayedSteps
    .map((step) => {
      // Skip the "Already Registered" step in the steps array
      if (step.label === "Already Registered") {
        return null; // Skip this step
      }

      if (step.label === "Upload Resume") {
        return {
          label: step.label,
          name: "resume",
          type: "file",
          rules: {
            required: "Resume is required",
          },
        };
      } else if (step.label === "Check Resume Data") {
        return {
          isModal: true, // Flag to indicate this is the modal step
          label: step.label,
          name: "VideoRecord",
        };
      } else if (step.label === "Record Introduction Video") {
        return {
          isVideo: true, // New step for video recording
          label: step.label,
        };
      } else {
        return {
          label: step.label,
          name: step.label.toLowerCase().replace(/\s/g, ""),
          type: step.label === "Password" ? "password" : "text",
          rules: {
            required: `${step.label} is required`,
          },
        };
      }
    })
    .filter((step) => step !== null); // Filter out null values (skipped steps)

  let fieldValue = watch(steps[currentStep]?.name);
  if (steps[currentStep]?.name === "VideoRecord") {
    fieldValue = true;
  }

  const isStepValid = useCallback(() => {
    if (currentStep === 2) {
      return !!previewUrl;
    } else {
      return fieldValue && !errors[steps[currentStep]?.name];
    }
  }, [currentStep, previewUrl, fieldValue, errors, steps]);

  const handleNext = useCallback(async () => {
    setIsUserRegistered(false);
    stopAudio();

    const formDataAllValues = getValues(); // Retrieve all form data
    if (!isStepValid()) return;

    setDirection(1);
    if (steps[currentStep]?.name === "resume") {
      const formData = new FormData();
      formData.append("file", formDataAllValues?.resume);
      formData.append("custom_criteria", "");
      const response = await extractDetails(formData);

      axios
        .post(
          `${import.meta.env.VITE_PYTHON_URL}analyze_video/?video_url=${
            import.meta.env.VITE_SERVER_URL
          }/video/${VideId}`,
          null,
          { withCredentials: true }
        )
        .then(async () => {
          try {
            console.log("helo res");
          } catch (err) {
            console.error(err);
          }
        })
        .catch((error) => console.error("Error:", error));
      const images = response?.data?.data?.resume?.Images;

      if (
        Array.isArray(images) &&
        images.length > 0 &&
        typeof images[0]?.base64 === "string" &&
        images[0].base64.trim() !== ""
      ) {
        const ResumeDataWithImage = {
          ...response?.data?.data?.resume,
          Images: `data:image/png;base64,${images[0].base64}`,
        };
        setResumeData(ResumeDataWithImage);
      } else {
        setResumeData(response?.data.data?.resume);
      }

      dispatch(setSessionId(response.sessionId));
      setCurrentStep((prev) => prev + 1);
      return;
    }

    if (steps[currentStep]?.name === "email") {
      try {
        await checkExistingUser({ email: formDataAllValues?.email }).unwrap();
      } catch (error) {
        if (error?.data?.message?.includes("is already registered")) {
          setIsUserRegistered(true);
          toast.error(
            "This user is already registered. Please log in to see your dashboard."
          );
        }
      }
    }

    setCurrentStep((prev) => prev + 1);
  }, [
    setIsUserRegistered,
    stopAudio,
    getValues,
    isStepValid,
    setDirection,
    steps,
    currentStep,
    extractDetails,
    VideId,
    setResumeData,
    dispatch,
    checkExistingUser,
    setCurrentStep,
  ]);

  const handlePrevious = () => {
    setIsUserRegistered(false);
    stopAudio();
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = useCallback(() => {
    if (currentStep < steps.length - 1) return;
  }, [currentStep, steps.length]);

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        if (isStepValid() && currentStep < steps.length - 1) {
          handleNext();
        } else if (currentStep === steps.length - 1) {
          handleSubmit(onSubmit)();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    currentStep,
    isStepValid,
    steps.length,
    handleNext,
    handleSubmit,
    onSubmit,
  ]);

  useEffect(() => {
    // Filter steps based on whether the URL includes "New" and step.isDisplaying

    const validSteps = stepMessages.filter((step) => {
      // Always respect the step.isDisplaying condition
      if (!step.isDisplaying) return false;
      // Include all steps for other cases
      return true;
    });
    if (validSteps[currentStep]) {
      if (
        localtion?.search?.includes("New") ||
        localtion?.search?.includes("edit")
      ) {
        if (currentStep >= 2) {
          StartSpeaks(validSteps[currentStep].message);
        }
      } else {
        StartSpeaks(validSteps[currentStep].message);
      }
    }
  }, [currentStep, isUserRegistered, localtion?.search, stepMessages]); // Add `localtion` to dependencies

  const [fileUploadError, setFileUploadError] = useState(null);

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
    if (validationResult === true) {
      return file;
    } else {
      return null;
    }
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

  async function handleLogin() {
    const formDataAllValues = getValues(); // Retrieve all form data
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
          parentID: "",
        })
      );

      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.data?.message);
    }
  }

  async function CreateProfile() {
    setLoadingSubmitResume(true);
    const formDataAllValues = getValues(); // Retrieve all form data
    if (localtion?.search?.includes("New")) {
      const response = await NewSubProfile({
        userID: userData?.user?.id,
        profile: FinalResumeData,
        evaluation_score: "",
        videoId: VideId,
      });
      const ResumeFile = new FormData();
      ResumeFile.append("resume", formDataAllValues?.resume);
      try {
        await uploadResume({
          file: ResumeFile,
          userID: response?.data?.data?.userSubProfileID,
        }).unwrap();
      } catch (error) {
        console.error("Upload failed:", error);
      }
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
      await evaluateResume({
        userId: userData?.user?.id,
        userProfileID: response?.data?.data?.userSubProfileID,
        is_edit: false,
      });
      navigate("/dashboard");
      setLoadingSubmitResume(false);
    } else if (localtion?.search?.includes("edit")) {
      if (selectedID?.parentID) {
        await updateUserSubProfile({
          data: {
            email: userData?.user?.email,
            profile: FinalResumeData,
          },
          id: userData?.user?.id,
          parentID: SelectID,
        });
      } else {
        await EditUserProfile({
          data: {
            email: userData?.user?.email,
            profile: FinalResumeData,
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
      } catch (error) {
        console.error("Upload failed:", error);
      }
      await evaluateResume({
        userId: userData?.user?.id,
        userProfileID: SelectID,
        is_edit: true,
      });
      navigate("/dashboard");
    } else {
      const response = await createProfile({
        email: formDataAllValues?.email,
        password: formDataAllValues?.password,
        profile: FinalResumeData,
        evaluation_score: "",
        videoId: VideId,
      });
      const ResumeFile = new FormData();
      ResumeFile.append("resume", formDataAllValues?.resume);

      try {
        await uploadResume({
          file: ResumeFile,
          userID: response?.data?.user?.id,
        }).unwrap();
      } catch (error) {
        console.error("Upload failed:", error);
      }
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
      dispatch(
        UpdateSelectedProfile({
          parentID: "",
          id: response?.data?.user?.id,
        })
      );
      await evaluateResume({
        userId: response?.data?.user?.id,
        userProfileID: response?.data?.user?.id,
        is_edit: false,
      });
      navigate("/dashboard");
    }
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 flexWrap shadow-lg gap-10 rounded-lg overflow-hidden max-w-full w-full flex">
        {/* Right Section */}
        <div className="w-[60%] pt-5 PaddingX flex flex-col justify-between MobileSize">
          <div className="">
            <div className="flex items-center">
              {currentStep > 0 && (
                <div className="">
                  <img
                    src="/arrowBack.svg"
                    alt="arrowBack"
                    className="w-[25px] cursor-pointer mr-3 ml-[-5px]"
                    onClick={handlePrevious}
                  />
                </div>
              )}
              <div>
                <div className="text-2xl md:text-3xl">
                  <span className="text-[#45A6A6] font-bold">Talking</span>
                  <span className="text-[#68B5B5] font-light">App</span>
                </div>
                <div className="text-[#9C9C9C] font-medium text-[0.7rem] md:text-[0.775rem] ml-2 mb-0 -mt-[7px]">
                  By WebTronix
                </div>
              </div>
            </div>

            <div noValidate className="mt-[1rem]">
              <h2 className="text-2xl font-semibold mb-6">
                {localtion?.search?.includes("edit")
                  ? "Edit Your Resume"
                  : "Start Your Journey"}
              </h2>
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  variants={variants}
                  custom={direction}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  {steps[currentStep]?.isVideo && !isUserRegistered ? (
                    <div className="mb-5">
                      <VideoRecording
                        setPreviewUrl={setPreviewUrl}
                        previewUrl={previewUrl}
                        setVideoID={setVideoID}
                        VideId={VideId}
                      />
                    </div>
                  ) : steps[currentStep]?.isModal && !isUserRegistered ? (
                    <SideModal
                      initialData={ResumeData}
                      setFinalResumeData={setFinalResumeData}
                    />
                  ) : (
                    <div className="mb-6">
                      <label className="block text-gray-700 text-base font-semibold mb-2">
                        {steps[currentStep].label}
                      </label>
                      {steps[currentStep].type === "file" &&
                      !isUserRegistered ? (
                        <div className=" ">
                          <Controller
                            name="resume"
                            control={control}
                            rules={{ required: "Resume is required" }}
                            render={({ field: { onChange, value } }) => (
                              <label
                                htmlFor="fileUpload"
                                className={`w-full rounded-lg p-10 cursor-pointer transition flex flex-col items-center
                w-full px-4 py-8 border rounded-md border-gray-300 focus:outline-none focus:ring-2
                ${
                  dragging
                    ? "border-gray-500 bg-gray-100"
                    : "border-gray-300 bg-white"
                }`}
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
                                    const validatedFile =
                                      handleFileChange(file);
                                    if (validatedFile) {
                                      onChange(validatedFile);
                                    }
                                  }}
                                />
                                <div className="flex justify-center mb-2">
                                  <img
                                    src="/Upload.svg"
                                    alt="upload"
                                    className="w-[20px]"
                                  />
                                </div>
                                <p className="text-[#696969] mb-2">
                                  {value
                                    ? value.name
                                    : dragging
                                    ? "Drop the file here"
                                    : "Click or Drag file to upload"}
                                </p>
                                <p className="text-xs text-[#696969] mt-1">
                                  Only .pdf, .docx, .doc, Max upload file size
                                  is 8MB
                                </p>
                              </label>
                            )}
                          />
                          {errors.resume && (
                            <DangerAlert message={errors.resume.message} />
                          )}
                          {fileUploadError && (
                            <div className="mt-1">
                              <DangerAlert message={fileUploadError} />
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          {steps[currentStep]?.name === "password" ? (
                            <div className="relative w-full">
                              <Controller
                                name="password"
                                control={control}
                                rules={steps[currentStep]?.rules}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                                    placeholder="Enter your password"
                                  />
                                )}
                              />
                              <span
                                className="absolute right-3 top-3 cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                              >
                                {showPassword ? <Eye /> : <EyeOff />}
                              </span>
                            </div>
                          ) : (
                            <Controller
                              name={steps[currentStep]?.name}
                              control={control}
                              rules={steps[currentStep]?.rules}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type={steps[currentStep]?.type}
                                  className="w-full px-4 py-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2"
                                  placeholder={`Enter your ${steps[currentStep]?.label}`}
                                />
                              )}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between items-center relative">
                {isUserRegistered && currentStep === 1 ? (
                  <button
                    type="button"
                    className="ml-auto w-[30%] px-4 py-3 text-base bg-[#176A66] text-white rounded-md hover:brightness-90"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                ) : currentStep < steps.length - 1 ? (
                  <>
                    <div className="flex justify-between items-center relative">
                      {isUserRegistered && currentStep === 2 ? (
                        <Link to="/login" className="w-full">
                          <button
                            type="button"
                            className="ml-auto w-[30%] px-4 py-3 text-base bg-[#176A66] text-white rounded-md hover:brightness-90"
                          >
                            Go to Login
                          </button>
                        </Link>
                      ) : currentStep < steps.length - 1 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={!isStepValid()}
                          className={`ml-auto w-[100%] px-4 py-3 justify-center text-base bg-[#176A66] text-white rounded-md ${
                            !isStepValid()
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:brightness-90"
                          }`}
                        >
                          {!isLoading ? "Next" : <LoadingButton />}
                        </button>
                      ) : (
                        <>
                          {!previewUrl ? (
                            ""
                          ) : (
                            <button
                              onClick={CreateProfile}
                              type="button"
                              className="ml-auto w-[30%] px-4 py-3 text-base bg-[#176A66] text-white rounded-md hover:brightness-90"
                            >
                              {isLoading ? <LoadingButton /> : "Submit2"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {!previewUrl ? (
                      ""
                    ) : (
                      <button
                        onClick={CreateProfile}
                        type="button"
                        className="ml-auto w-[30%] px-4 py-3 text-base bg-[#176A66] text-white rounded-md hover:brightness-90"
                      >
                        {LoadingSubmitResume ? <LoadingButton /> : "Submit"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="displayNoneInmobile">
            <img src="/logo.svg" alt="logo" />
          </div>
        </div>
        {/* /  // Left Section */}
        <div className="w-1/2 MobileSize relative rounded-md bg-gradient-to-b from-[#176A66] to-[#176A66] text-white padding2remMobile">
          {stepMessages
            .filter((step, index) => {
              // Skip the "Already Registered" step if the user is not registered
              if (step.label === "Already Registered" && !isUserRegistered) {
                return false;
              }
              // Skip steps beyond index 2 if the user is already registered
              if (isUserRegistered && index > 2) {
                return false;
              }
              return true; // Include all other steps
            })
            .map((step, index) => {
              return (
                <div
                  key={index}
                  className={`gap-3 padding7rem mt-10 rounded-lg transition-all `}
                >
                  {currentStep > index ? (
                    <>
                      <img
                        src="/tickCircleWhite.svg"
                        alt="checkmark"
                        className="w-[40px] mb-2 ml-[-7px]"
                      />
                      <div>
                        <h2 className="text-xl font-semibold mb-1 text-white">
                          {step.label}
                        </h2>
                        <p className="text-base mb-0 w-[90%] text-white">
                          {step.message}
                        </p>
                      </div>
                    </>
                  ) : currentStep === index ? (
                    <>
                      <img
                        src="/crossCircle.svg"
                        alt="checkmark"
                        className="w-[35px] mb-2 ml-[-7px]"
                      />
                      <div>
                        <h2 className="text-xl font-semibold mb-1 text-gray-400">
                          {step.label}
                        </h2>
                        <p className="text-base mb-0 w-[90%] text-gray-400">
                          {step.message}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src="/crossCircle.svg"
                        alt="checkmark"
                        className="w-[35px] mb-2 ml-[-7px]"
                      />
                      <div>
                        <h2 className="text-xl font-semibold mb-1 text-gray-400">
                          {step.label}
                        </h2>
                        <p className="text-base mb-0 w-[90%] text-gray-400">
                          {step.message}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

UserRegister.propTypes = {
  StartSpeaks: PropTypes.func.isRequired,
  stopAudio: PropTypes.func.isRequired,
};
