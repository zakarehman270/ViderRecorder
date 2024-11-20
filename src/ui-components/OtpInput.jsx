import { useState, useRef } from "react"
import { Input } from "./Input"

export const OtpInput = ({ length = 6, ...rest }) => {
    
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputs = useRef([]);

    const handleChange = (value, index) => {        
        const newOTP = [...otp];        
        newOTP[index] = value;
        setOtp(newOTP);
        
        if (value && index < length - 1) {
          inputs.current[index + 1].focus()
        }
    };

    const handleKeyPress = (event, index) => {
        
        // Move focus to the previous input if the user pressed the delete key
        if (event.nativeEvent.key === 'Backspace' && index > 0) {
            event.preventDefault()
            const newOtp = [...otp];
            newOtp[index] = ""; // Clear the current field
            setOtp(newOtp);
            inputs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData("text");
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split("").slice(0, length).forEach((char, i) => {
            newOtp[i] = char;
        });
        setOtp(newOtp);
        // onChange(newOtp.join(""));
        inputs.current[length - 1].focus()

    }

    return (
        <div className="flex justify-center flex-row space-x-3">
            
            {otp.map((data, index) => (
                <Input
                    key={index}     
                    placeholder={'\u041E'}               
                    maxLength="1"
                    isOtp                    
                    ref={(input) => (inputs.current[index] = input)}                    
                    value={data}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyPress(e, index)}
                    onPaste={handlePaste}
                />
            ))}
            <input type="hidden" value={otp?.join('')} {...rest} />
        </div>
    );
};

