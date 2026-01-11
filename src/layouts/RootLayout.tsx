import { Outlet } from "react-router"

const RootLayout = () => {
    return (
        <div className="min-h-screen h-full w-full">
            <Outlet />
        </div>
    )
}

export default RootLayout