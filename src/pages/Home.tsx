import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { Blog } from "../types/blogs";


function Home() {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    async function getBlogs() {
        const { data } = await supabase.from("blogs").select("*").range(0, 9);
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
        <>
            <h1 className="text-xl font-bold text-blue-300">Hello</h1>
            <ul>
                {blogs.map((blog) => (
                    <li key={blog.title}>{blog.body}</li>
                ))}
            </ul>
        </>
    );
}

export default Home;