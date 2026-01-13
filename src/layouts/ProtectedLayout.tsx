import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router"
import { supabase } from "../supabaseClient";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { setUser } from "../slice/userSlice";
import { useAppDispatch, useAppSelector } from "../hooks/store-hooks";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import SetProfileModal from "../components/SetProfileModal";
import { setUserHasProfile } from "../slice/userHasProfileSlice";

const ProtectedLayout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userHasProfile = useAppSelector((state) => state.userHasProfile.value);
    const [isCheckingProfile, setIsCheckingProfile] = useState(true);

    useEffect(() => {
        let user: User | null = null

        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error || !data.session) {
                navigate("/login");
                return;
            }

            dispatch(setUser(data?.session?.user));
            user = data?.session?.user;
        }


        const checkUserProfile = async () => {
            if (!user) return

            const { data, error, } = await supabase
                .from('profile')
                .select("*")
                .eq('id', user?.id)

            if (error) {
                toast.error(error.message)
                dispatch(setUserHasProfile(false));
            }


            if (data && data.length > 0) {
                toast.success(`Hello, ${data[0]?.display_name || 'user'}!`);
                dispatch(setUserHasProfile(true));
            } else {
                dispatch(setUserHasProfile(false));
            }
        }

        const runChecks = async () => {
            await checkSession();
            await checkUserProfile();
            setIsCheckingProfile(false);
        }

        runChecks();
    }, [navigate, dispatch])

    return (
        <div className="w-full h-full flex flex-col items-center relative">
            <Header>
                <Navigation />
            </Header>
            <main className="w-[60%] flex flex-col items-center">
                <Outlet />
            </main>

            <SetProfileModal isOpen={!isCheckingProfile && !userHasProfile} onRequestClose={() => dispatch(setUserHasProfile(true))} />
        </div>
    )
}

export default ProtectedLayout