type InputLabelGroupProps = {
    children: React.ReactNode;
}

const InputLabelGroup = ({ children, ...props }: InputLabelGroupProps) => {
    return (
        <div
            className="w-full flex flex-col gap-1"
            {...props}
        >
            {children}
        </div>
    )
}

export default InputLabelGroup