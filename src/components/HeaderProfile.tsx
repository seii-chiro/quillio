import LogoutBtn from './LogoutBtn'
import type { Profile } from '../types/profile'
import { Link } from 'react-router'

type HeaderProfileProps = {
    userProfile: Profile | null;
}

const HeaderProfile = ({ userProfile }: HeaderProfileProps) => {
    return (
        <>
            <div className="hidden md:flex items-center justify-end absolute right-4 top-0 bottom-0">
                {userProfile && (
                    <div className="flex justify-center items-center gap-3">
                        <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            {userProfile.avatar ? (
                                <img
                                    src={userProfile.avatar}
                                    alt={userProfile.display_name || 'User'}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-sky-500"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-semibold">
                                    {userProfile.display_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                            <span className="text-sm font-medium text-slate-700">
                                {userProfile.display_name || 'User'}
                            </span>
                        </Link>
                        <span>
                            <LogoutBtn />
                        </span>
                    </div>
                )}
            </div>

            <div className='md:hidden flex items-center justify-end absolute right-4 top-0 bottom-0'>
                {userProfile && (
                    <div className="flex justify-center items-center gap-2">
                        <Link to="/profile" className="flex items-center hover:opacity-80 transition-opacity">
                            {userProfile.avatar ? (
                                <img
                                    src={userProfile.avatar}
                                    alt={userProfile.display_name || 'User'}
                                    className="w-8 h-8 rounded-full object-cover border-2 border-sky-500"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-semibold">
                                    {userProfile.display_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                        </Link>
                        <span>
                            <LogoutBtn />
                        </span>
                    </div>
                )}
            </div>
        </>
    )
}

export default HeaderProfile