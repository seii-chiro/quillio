import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { BlogWithAuthor } from "../types/blogs";
import BlogCard from "../components/BlogCard";
import { useAppSelector } from "../hooks/store-hooks";

const PAGE_SIZE = 10;

function Home() {
    const [blogs, setBlogs] = useState<BlogWithAuthor[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const user = useAppSelector((state) => state.user.value);

    async function getBlogs(page: number): Promise<BlogWithAuthor[] | null> {
        const start = page * PAGE_SIZE;
        const end = start + PAGE_SIZE - 1;
        const { data } = await supabase
            .from("blogs")
            .select(`id, created_at, title, body, user_id, only_me, image, author:profile(display_name, avatar)`)
            .eq('only_me', false)
            .range(start, end)
            .order("created_at", { ascending: false });
        return data;
    }

    useEffect(() => {
        async function loadBlogs(page: number) {
            setIsLoading(true);
            try {
                const data = await getBlogs(page);
                setBlogs(data || []);
                setHasMore(data ? data.length === PAGE_SIZE : false);
            } catch (error) {
                console.error("Failed to load blogs", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadBlogs(currentPage);
    }, [currentPage]);

    if (!user) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <p>Please log in to view the feed.</p>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-6 mt-8 mb-16">
            <h1 className="text-center text-2xl font-bold">Feed</h1>
            <div className="flex flex-col w-full items-center justify-center">
                <ul className="w-full flex flex-col gap-4">
                    {blogs.map((blog) => (
                        <li key={blog.id}>
                            <BlogCard blog={blog} />
                        </li>
                    ))}
                </ul>

                {isLoading && (
                    <p className="text-center mt-4">Loading...</p>
                )}

                {blogs.length === 0 && !isLoading && (
                    <p className="text-center mt-4">No blogs found</p>
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
    );
}

export default Home;