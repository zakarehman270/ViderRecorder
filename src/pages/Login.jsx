import DangerAlert from "@/Components/DangerAlert";
import LoadingButton from "@/Components/LoadingButton";
import { useLogInMutation } from "@/redux/api/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react"; // Import Lucide eye icons
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [login, {isLoading,  }] = useLogInMutation();

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    login(data).unwrap()
    .then((response) => {
      localStorage.setItem("AdminLogin",JSON.stringify(response))
      toast.success()
      if (response?.statusCode === 200) {
        toast.success("Successfully login")
        navigate("/admin");
      }
    }).catch((error)=>{
      toast.error(error?.data?.message)
    })
    
  };
  

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#fafafc] p-4 overflow-hidden">
      {/* Small Logo (Top Left) */}
      <div className="absolute left-6 top-6 flex items-center space-x-2 z-10">
        <div className="mb-[10rem]">
          <div className="text-2xl md:text-3xl">
            <span className="text-[#45A6A6] font-bold">Talking</span>
            <span className="text-[#68B5B5] font-light">Me</span>
          </div>
          <div className="text-[#9C9C9C] font-medium text-[0.7rem] md:text-[0.775rem] ml-2 mb-0 -mt-[7px]">
            By WebTronix
          </div>
        </div>
      </div>
      <div className="absolute left-[1rem] top-[31.5rem] w-[300px] h-[300px] opacity-20 backdrop-blur-lg">
        <img
          src="/logo.svg"
          alt="Background Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-8 shadow-[0px_3px_8px_rgba(0,0,0,0.24)]">
        <p className="login-text">Login</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-base mb-1 font-medium text-[#a4a4a2]">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              })}
              className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
            />
            {errors.email && <DangerAlert message={errors.email.message} />}
          </div>

          <div className="mt-4">
            <label className="block text-base mb-1 font-medium text-[#a4a4a2]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="mt-1 w-full rounded-md border border-[#dedede] p-2 focus:border-blue-500 focus:outline-none"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)} 
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.password && <DangerAlert message={errors.password.message} />}
          </div>
          <button
            type={isLoading ? "button" : "submit"}
            className="mt-4 w-full rounded-md bg-[#258e8e] p-2 text-white hover:bg-[#0b4646]"
          >
            {isLoading ? <LoadingButton /> :  "Login" }
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;