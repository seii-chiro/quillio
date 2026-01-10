import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

type Blog = {
    id: string;
    title: string;
    body: string;
    created_at: Date;
};

function Home() {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    async function getBlogs() {
        const { data } = await supabase.from("blogs").select();
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
        <ul>
            {blogs.map((blog) => (
                <li key={blog.title}>{blog.body}</li>
            ))}
        </ul>
    );
}

export default Home;