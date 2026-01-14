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
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error || !data.session) {
                navigate("/login");
                return null;
            }

            dispatch(setUser(data?.session?.user));
            return data?.session?.user;
        }


        const checkUserProfile = async (user: User | null) => {
            if (!user) return

            const { data, error, } = await supabase
                .from('profile')
                .select("*")
                .eq('id', user?.id)
                .single();

            if (error) {
                toast.error(error.message)
                dispatch(setUserHasProfile(false));
                return
            }


            if (data) {
                toast.success(`Hello, ${data?.display_name || 'user'}!`);
                dispatch(setUserHasProfile(true));
            } else {
                dispatch(setUserHasProfile(false));
            }
        }

        const runChecks = async () => {
            const user = await checkSession();
            await checkUserProfile(user);
            setIsCheckingProfile(false);
        }

        runChecks();
    }, [navigate, dispatch])

    return (
        <div className="w-full h-full flex flex-col items-center relative">
            <Header>
                <Navigation />
            </Header>
            <main className="w-[95%] lg:w-[60%] flex flex-col items-center">
                <Outlet />
            </main>

            <SetProfileModal isOpen={!isCheckingProfile && !userHasProfile} onRequestClose={() => dispatch(setUserHasProfile(true))} />
        </div>
    )
}

export default ProtectedLayout