type HeaderProps = {
    children: React.ReactNode;
}

const Header = ({ children }: HeaderProps) => {
    return (
        <header className="w-full flex md:justify-center items-center p-2 sticky top-0">
            {children}
        </header>
    )
}

export default Header