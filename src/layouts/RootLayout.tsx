import { Outlet } from "react-router"
import { Toaster } from "sonner"

const RootLayout = () => {
    return (
        <div className="min-h-screen h-full w-full">
            <Toaster />
            <Outlet />
        </div>
    )
}

export default RootLayout