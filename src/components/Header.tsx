const Header = ({ children }: { children: React.ReactNode }) => {
    return (
        <header className="w-full flex flex-col justify-center items-center p-4 sticky top-0">{children}</header>
    )
}

export default Header