import { useEffect, useState } from 'react';
import CreateBlogModalBtn from '../components/CreateBlogModalBtn'
import type { BlogWithAuthor } from '../types/blogs';
import { supabase } from '../supabaseClient';
import BlogCard from '../components/BlogCard';
import { useAppSelector } from '../hooks/store-hooks';

const PAGE_SIZE = 10;

const MyBlogs = () => {
    const [myBlogs, setMyBlogs] = useState<BlogWithAuthor[]>([]);
    const user = useAppSelector((state) => state.user.value)
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        async function getBlogs(page: number): Promise<BlogWithAuthor[] | null> {
            if (!user) return null;

            const start = page * PAGE_SIZE
            const end = start + PAGE_SIZE - 1;
            const { data } = await supabase
                .from("blogs")
                .select(`id, created_at, title, body, user_id, only_me, author:profile(display_name)`)
                .eq('user_id', user?.id)
                .range(start, end)
                .order("created_at", { ascending: false });
            return data;
        }

        async function loadBlogs(page: number) {
            setIsLoading(true);
            try {
                const data = await getBlogs(page);
                setMyBlogs(data || []);
                setHasMore(data ? data.length === PAGE_SIZE : false);
            } catch (error) {
                console.error("Failed to load blogs", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadBlogs(currentPage);
    }, [user, currentPage]);

    return (
        <div className="w-full flex flex-col gap-6 mt-8 mb-16">
            <div className='w-full flex justify-between items-center'>
                <h2 className="text-2xl font-semibold text-center">My Blogs</h2>
                <CreateBlogModalBtn />
            </div>

            <div className="flex flex-col w-full items-center justify-center">
                <ul className="w-full flex flex-col gap-4">
                    {myBlogs.map((blog) => (
                        <li key={blog.id}>
                            <BlogCard blog={blog} isInMyBlogs={true} />
                        </li>
                    ))}
                </ul>


                {isLoading && (
                    <p className="text-center text-gray-500 mt-4">Loading...</p>
                )}

                {myBlogs.length === 0 && !isLoading && (
                    <p className="text-center text-gray-500 mt-4">No blogs found</p>
                )}

                <div className="flex gap-4 items-center justify-center mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={currentPage === 0 || isLoading}
                        className="w-28 px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-600">
                        Page {currentPage + 1}
                    </span>

                    <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={!hasMore || isLoading}
                        className="w-28 px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MyBlogs