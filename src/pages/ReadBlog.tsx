import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router'
import { supabase } from '../supabaseClient'
import type { BlogWithAuthor } from '../types/blogs'
import { formatDate } from '../utils/formatDate'
import { FaUser, FaCalendarAlt, FaLock, FaArrowLeft } from 'react-icons/fa'
import { useAppSelector } from '../hooks/store-hooks'
import EditBlogModalBtn from '../components/EditBlogModalBtn'
import ConfirmDeleteBlogBtn from '../components/ConfirmDeleteBlogBtn'

const ReadBlog = () => {
    const { id } = useParams<{ id: string }>()
    const user = useAppSelector((state) => state.user.value)
    const [blog, setBlog] = useState<BlogWithAuthor | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchBlog() {
            if (!id) {
                setError('Blog ID not provided')
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select(`id, created_at, title, body, user_id, only_me, author:profile(display_name)`)
                    .eq('id', Number(id))
                    .single()

                if (error) {
                    setError('Blog not found')
                    setIsLoading(false)
                    return
                }

                // tho i know that this won't happen because i filtered out all private blogs in the list
                if (data.only_me && data.user_id !== user?.id) {
                    setError('This blog is private')
                    setIsLoading(false)
                    return
                }

                setBlog(data)
            } catch (err) {
                setError('Failed to load blog')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBlog()
    }, [id, user?.id])

    if (isLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading blog...</p>
            </div>
        )
    }

    if (error || !blog) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-red-500 text-lg">{error || 'Blog not found'}</p>
                <Link
                    to="/blogs"
                    className="text-sky-600 hover:underline flex items-center gap-2"
                >
                    <FaArrowLeft />
                    Back to Blogs
                </Link>
            </div>
        )
    }

    const isAuthor = user?.id === blog.user_id
    const authorName = blog.author?.display_name ?? 'Unknown'

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 mb-16">
            <Link
                to="/blogs"
                className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-6 text-sm"
            >
                <FaArrowLeft />
                Back to Blogs
            </Link>

            <article className="bg-white rounded-lg shadow-md p-8">
                <header className="border-b border-slate-200 pb-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-3xl font-bold text-slate-900">{blog.title}</h1>
                        {blog.only_me && (
                            <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-md text-sm whitespace-nowrap">
                                <FaLock className="text-yellow-700" />
                                Private
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                            <FaUser className="text-slate-400" />
                            {authorName}
                        </span>
                        <span className="flex items-center gap-2">
                            <FaCalendarAlt className="text-slate-400" />
                            {formatDate(blog.created_at)}
                        </span>
                    </div>
                </header>

                <div className="mt-8">
                    <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">
                        {blog.body}
                    </p>
                </div>

                {isAuthor && (
                    <footer className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
                        <EditBlogModalBtn blog={blog} />
                        <ConfirmDeleteBlogBtn blogId={blog.id} />
                    </footer>
                )}
            </article>
        </div>
    )
}

export default ReadBlog