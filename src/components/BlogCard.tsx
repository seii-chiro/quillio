import { Link } from "react-router";
import { FaUser, FaCalendarAlt, FaLock } from "react-icons/fa";
import type { BlogWithAuthor } from "../types/blogs";
import { formatDate } from "../utils/formatDate";
import EditBlogModalBtn from "./EditBlogModalBtn";
import ConfirmDeleteBlogBtn from "./ConfirmDeleteBlogBtn";
import { FaRegComments } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import { AiOutlineLike } from "react-icons/ai";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { useAppSelector } from "../hooks/store-hooks";

type BlogCardProps = {
    blog: BlogWithAuthor;
    isInMyBlogs?: boolean;
    onBlogUpdated?: (blog: BlogWithAuthor) => void;
    onBlogDeleted?: (blogId: number) => void;
};


const BlogCard = ({ blog, isInMyBlogs, onBlogUpdated, onBlogDeleted }: BlogCardProps) => {
    const [likeCount, setLikeCount] = useState<number>(0);
    const [commentCount, setCommentCount] = useState<number>(0);
    const [userHasLiked, setUserHasLiked] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user.value)
    const { title, author, created_at, body, only_me, id, image } = blog;


    const authorName = author?.display_name ?? "Unknown";

    useEffect(() => {
        const getCommentCount = async () => {
            const { count, error } = await supabase
                .from('comments')
                .select('*', { count: 'exact', head: true })
                .eq('blog_id', id);

            if (error) {
                toast.error(`Error fetching comment count: ${error.message}`);
            }

            setCommentCount(count || 0);
        }

        const getLikes = async () => {
            const { count, error } = await supabase
                .from('likes')
                .select('*', { count: 'exact', head: true })
                .eq('blog_id', id);

            if (error) {
                toast.error(`Error fetching likes: ${error.message}`);
            }

            setLikeCount(count || 0);
        }

        const checkUserLike = async () => {
            if (!user) {
                toast.warning('Log in to like blogs');
                return;
            }

            const { data, error } = await supabase
                .from('likes')
                .select('*')
                .eq('blog_id', id)
                .eq('profile_id', user?.id)
                .maybeSingle();

            if (error) {
                toast.error('Error fetching likes');
            }

            if (data?.blog_id === id && data?.profile_id === user?.id) {
                setUserHasLiked(true);
            }
        }


        getLikes();
        checkUserLike();
        getCommentCount();
    }, [id, user])

    const handleLikeToggle = async () => {
        if (!user) {
            toast.warning('Log in to like blogs');
            return;
        }

        if (userHasLiked) {
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('blog_id', id)
                .eq('profile_id', user?.id);

            if (error) {
                toast.error('Error unliking the blog');
                return;
            }

            setLikeCount(likeCount - 1);
            setUserHasLiked(false);
        } else {
            const { error } = await supabase
                .from('likes')
                .insert([{ blog_id: id, profile_id: user?.id }]);

            if (error) {
                toast.error('Error liking the blog');
                return;
            }

            setLikeCount(likeCount + 1);
            setUserHasLiked(true);
        }
    };

    return (
        <article className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition">
            <header>
                <div className="w-full flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800 line-clamp-3">{title}</h3>
                    {
                        isInMyBlogs && (
                            <ConfirmDeleteBlogBtn blogId={blog.id} onBlogDeleted={onBlogDeleted} />
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

            {image && (
                <div className="mt-4">
                    <img src={image} alt={title} className="w-full h-48 object-cover rounded-md" />
                </div>
            )}

            <p className="mt-4 text-sm text-slate-700 line-clamp-3">{body}</p>

            <div className="w-full mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-5">
                    <div className="w-full">
                        <button
                            className="flex items-center"
                            onClick={handleLikeToggle}
                        >
                            {userHasLiked ? (
                                <AiFillLike className="text-blue-600 w-5 h-5" />
                            ) : (
                                <AiOutlineLike className="text-slate-600 w-5 h-5 hover:text-sky-500 transition-all hover:scale-105 active:scale-125 ease-in-out" />
                            )}
                            <span className="ml-1 text-sm text-slate-700">{likeCount}</span>
                        </button>
                    </div>
                    <div className="flex items-center">
                        <Link to={`/blogs/${id}`} className="hover:text-sky-500 transition-all hover:scale-105 active:scale-125 ease-in-out">
                            <FaRegComments size={20} />
                        </Link>
                        <span className="ml-1 text-sm text-slate-700">{commentCount}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {
                        isInMyBlogs && (
                            <EditBlogModalBtn blog={blog} onBlogUpdated={onBlogUpdated} />
                        )
                    }
                    <Link to={`/blogs/${id}`} className="text-sm bg-sky-600 text-white px-3 py-1.5 rounded hover:bg-sky-700 transition">
                        Read
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;