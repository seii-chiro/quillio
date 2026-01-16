type HeaderProps = {
    children: React.ReactNode;
}

const Header = ({ children }: HeaderProps) => {
    return (
        <header className="w-full flex md:justify-center items-center p-2 sticky top-0 z-50 filter:blur-bg bg-white/10 backdrop-blur-sm">
            {children}
        </header>
    )
}

export default Header