import { Link } from "react-router"

const Navigation = () => {
    return (
        <nav>
            <ul className="flex gap-4">
                <li>
                    <Link to={"/"}>Home</Link>
                </li>
                <li>
                    <Link to={"/my-blogs"}>My Blogs</Link>
                </li>
                <li>
                    <Link to={"/settings"}>Settings</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navigation