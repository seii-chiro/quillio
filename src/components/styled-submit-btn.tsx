type FormSubmitButtonProps = {
    children: React.ReactNode;
}

const FormSubmitButton = ({ children, ...props }: FormSubmitButtonProps) => {
    return (
        <button
            type="submit"
            className="mt-2 w-full bg-black hover:inset-0.5 text-white py-2 rounded-md font-medium transition-colors duration-150"
            {...props}
        >
            {children}
        </button>
    )
}

export default FormSubmitButton