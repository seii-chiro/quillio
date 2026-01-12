import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { BlogWithAuthor } from "../types/blogs";
import BlogCard from "../components/BlogCard";

function Home() {
    const [blogs, setBlogs] = useState<BlogWithAuthor[]>([]);

    async function getBlogs(): Promise<BlogWithAuthor[] | null> {
        const { data } = await supabase.from("blogs").select(`id, created_at, title, body, user_id, only_me, author:profile(display_name)`).range(0, 9);
        return data;
    }

    useEffect(() => {
        getBlogs()
            .then((data) => {
                setBlogs(data || []);
            })
            .catch((error) => {
                console.error("Failed to load blogs", error);
            });

    }, []);

    return (
        <div className="flex flex-col gap-6 mt-8 mb-16">
            <h1 className="text-center text-2xl font-bold">Feed</h1>
            <div className="flex flex-col gap-4 w-full items-center justify-center">
                <ul className="w-[60%]">
                    {blogs.map((blog) => (
                        <li key={blog.id}>
                            <BlogCard blog={blog} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;