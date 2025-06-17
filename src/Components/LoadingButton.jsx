
import { ThreeDots } from "react-loader-spinner";
const LoadingButton = () => {
  return (
      <ThreeDots
        visible={true}
        height="40"
        width="40"
        color="#fff"
        radius="9"
        ariaLabel="three-dots-loading"
      />
  );
};

export default LoadingButton;
