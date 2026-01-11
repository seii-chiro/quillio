import { NavLink } from "react-router"
import LogoutBtn from "./LogoutBtn"

const Navigation = () => {
    return (
        <nav className="bg-white rounded-full px-6 py-2 shadow-xl">
            <ul className="flex items-center gap-8">
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? 'text-sky-600 pb-1 border-b-2 border-sky-600' : 'text-slate-700 hover:text-slate-900'
                        }
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/my-blogs"
                        className={({ isActive }) =>
                            isActive ? 'text-sky-600 pb-1 border-b-2 border-sky-600' : 'text-slate-700 hover:text-slate-900'
                        }
                    >
                        My Blogs
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            isActive ? 'text-sky-600 pb-1 border-b-2 border-sky-600' : 'text-slate-700 hover:text-slate-900'
                        }
                    >
                        Settings
                    </NavLink>
                </li>
                <li>
                    <LogoutBtn />
                </li>
            </ul>
        </nav>
    )
}

export default Navigation