import { useEffect, useState } from 'react';
import CreateBlogModalBtn from '../components/CreateBlogModalBtn'
import type { BlogWithAuthor } from '../types/blogs';
import { supabase } from '../supabaseClient';
import BlogCard from '../components/BlogCard';
import { useAppSelector } from '../hooks/store-hooks';


const MyBlogs = () => {
    const [myBlogs, setMyBlogs] = useState<BlogWithAuthor[]>([]);
    const user = useAppSelector((state) => state.user.value)


    useEffect(() => {
        async function getBlogs(): Promise<BlogWithAuthor[] | null> {
            if (!user) return null;

            const { data } = await supabase
                .from("blogs")
                .select(`id, created_at, title, body, user_id, only_me, author:profile(display_name)`)
                .eq('user_id', user?.id)
                .range(0, 9);
            return data;
        }

        getBlogs()
            .then((data) => {
                setMyBlogs(data || []);
            })
            .catch((error) => {
                console.error("Failed to load blogs", error);
            });

    }, [user]);

    return (
        <div className="w-full flex flex-col gap-6 mt-8 mb-16">
            <div className='w-full flex justify-between'>
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
            </div>
        </div>
    )
}

export default MyBlogs