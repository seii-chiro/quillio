import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router"
import { supabase } from "../supabaseClient";

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

    return <Outlet />
}

export default ProtectedLayout