import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import Navigation from "../components/Navigation";

const ProtectedLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error || !data.session) {
                navigate("/login");
                return;
            }
        }
        checkSession();
    }, [navigate])

    return (
        <div className="w-full h-full">
            <Header>
                <Navigation />
            </Header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default ProtectedLayout