import { Outlet } from "react-router"
import { Toaster } from "sonner"

const RootLayout = () => {
    return (
        <div className="h-screen w-full">
            <Toaster />
            <Outlet />
        </div>
    )
}

export default RootLayout