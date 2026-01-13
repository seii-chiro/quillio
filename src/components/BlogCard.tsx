import { Link } from "react-router";
import { FaUser, FaCalendarAlt, FaLock } from "react-icons/fa";
import type { BlogWithAuthor } from "../types/blogs";
import { formatDate } from "../utils/formatDate";
import EditBlogModalBtn from "./EditBlogModalBtn";
import ConfirmDeleteBlogBtn from "./ConfirmDeleteBlogBtn";

type BlogCardProps = {
    blog: BlogWithAuthor;
    isInMyBlogs?: boolean;
};


const BlogCard = ({ blog, isInMyBlogs }: BlogCardProps) => {
    const { title, author, created_at, body, only_me, id } = blog;
    const authorName = author?.display_name ?? "Unknown";

    return (
        <article className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition">
            <header>
                <div className="w-full flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                    {
                        isInMyBlogs && (
                            <ConfirmDeleteBlogBtn blogId={blog.id} />
                        )
                    }
                </div>
                <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-2">
                        <FaUser className="text-slate-400" />
                        {authorName}
                    </span>
                    <span className="flex items-center gap-2">
                        <FaCalendarAlt className="text-slate-400" />
                        {formatDate(created_at)}
                    </span>
                    {only_me && (
                        <span className="ml-auto inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs">
                            <FaLock className="text-yellow-700" />
                            Private
                        </span>
                    )}
                </div>
            </header>

            <p className="mt-4 text-sm text-slate-700">{body}</p>

            <div className="mt-4 flex items-center justify-end gap-3">
                {
                    isInMyBlogs && (
                        <EditBlogModalBtn blog={blog} />
                    )
                }
                <Link to={`/blogs/${id}`} className="text-sm bg-sky-600 text-white px-3 py-1.5 rounded hover:bg-sky-700 transition">
                    Read
                </Link>
            </div>
        </article>
    );
};

export default BlogCard;