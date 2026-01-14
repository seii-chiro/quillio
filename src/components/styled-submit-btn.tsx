type FormSubmitButtonProps = {
    children: React.ReactNode;
    disabled?: boolean;
}

const FormSubmitButton = ({ children, disabled, ...props }: FormSubmitButtonProps) => {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="mt-2 cursor-pointer w-full bg-black hover:inset-0.5 text-white py-2 rounded-md font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            {...props}
        >
            {children}
        </button>
    )
}

export default FormSubmitButton