import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { setUser } from "../slice/userSlice";
import { useAppDispatch } from "../hooks/store-hooks";

const ProtectedLayout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error || !data.session) {
                navigate("/login");
                return;
            }

            dispatch(setUser(data?.session?.user));
        }
        checkSession();
    }, [navigate, dispatch])

    return (
        <div className="w-full h-full flex flex-col items-center relative">
            <Header>
                <Navigation />
            </Header>
            <main className="w-[60%] flex flex-col items-center">
                <Outlet />
            </main>
        </div>
    )
}

export default ProtectedLayout