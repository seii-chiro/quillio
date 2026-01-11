import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

type PasswordToggleProps = {
    isPasswordVisible: boolean;
    togglePasswordVisibility: () => void;
}

const PasswordToggle = ({ isPasswordVisible, togglePasswordVisibility }: PasswordToggleProps) => {
    return (
        <button onClick={togglePasswordVisibility} className="absolute right-2 top-0 bottom-0" type="button">
            {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
        </button>
    )
}

export default PasswordToggle