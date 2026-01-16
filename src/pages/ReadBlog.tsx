import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { supabase } from '../supabaseClient'
import type { BlogWithAuthor } from '../types/blogs'
import type { CommentWithAuthor, CommentInsert } from '../types/comment'
import { formatDate } from '../utils/formatDate'
import { FaUser, FaCalendarAlt, FaLock, FaArrowLeft } from 'react-icons/fa'
import { useAppSelector } from '../hooks/store-hooks'
import EditBlogModalBtn from '../components/EditBlogModalBtn'
import ConfirmDeleteBlogBtn from '../components/ConfirmDeleteBlogBtn'
import { toast } from 'sonner'
import CommentForm from '../components/CommentForm'
import Comments from '../components/Comments'

const ReadBlog = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const user = useAppSelector((state) => state.user.value)
    const [blog, setBlog] = useState<BlogWithAuthor | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [comments, setComments] = useState<CommentWithAuthor[]>([])
    const [commentText, setCommentText] = useState('')
    const [commentImageFile, setCommentImageFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loadingComments, setLoadingComments] = useState(false)

    const handleBlogUpdated = (updatedBlog: BlogWithAuthor) => {
        setBlog(updatedBlog)
    }

    const handleBlogDeleted = () => {
        navigate('/my-blogs')
    }

    const fetchComments = useCallback(async () => {
        if (!id) return

        setLoadingComments(true)
        try {
            const { data, error } = await supabase
                .from('comments')
                .select(`*, author:profile(*)`)
                .eq('blog_id', Number(id))
                .order('created_at', { ascending: false })

            if (error) {
                toast.error('Failed to load comments')
                console.error(error)
                return
            }

            setComments(data || [])
        } catch (err) {
            toast.error('Failed to load comments')
            console.error(err)
        } finally {
            setLoadingComments(false)
        }
    }, [id])

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!commentText.trim()) {
            toast.error('Comment cannot be empty')
            return
        }

        if (!user?.id) {
            toast.error('You must be logged in to comment')
            return
        }

        setIsSubmitting(true)
        try {
            let imageUrl: string | null = null

            if (commentImageFile) {
                const fileExt = commentImageFile.name.split('.').pop()
                const fileName = `${user.id}-${Date.now()}.${fileExt}`
                const filePath = `private/${user.id}/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('comment_images')
                    .upload(filePath, commentImageFile)

                if (uploadError) {
                    toast.error('Failed to upload image')
                    console.error(uploadError)
                    setIsSubmitting(false)
                    return
                }

                const { data, error: urlError } = await supabase.storage
                    .from('comment_images')
                    .createSignedUrl(filePath, 60 * 60 * 24 * 365)

                if (urlError || !data) {
                    toast.error('Failed to generate image URL')
                    console.error(urlError)
                    setIsSubmitting(false)
                    return
                }

                imageUrl = data.signedUrl
            }

            const newComment: CommentInsert = {
                blog_id: Number(id),
                profile_id: user.id,
                comment: commentText.trim(),
                comment_image: imageUrl
            }

            const { error } = await supabase
                .from('comments')
                .insert(newComment)

            if (error) {
                toast.error('Failed to add comment')
                console.error(error)
                return
            }

            toast.success('Comment added')
            setCommentText('')
            setCommentImageFile(null)
            await fetchComments()
        } catch (err) {
            toast.error('Failed to add comment')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteComment = async (commentId: number) => {
        if (!user?.id) {
            toast.error('You must be logged in to delete comments')
            return
        }

        const comment = comments.find(c => c.id === commentId)
        if (!comment) return

        if (comment.profile_id !== user.id) {
            toast.error('You can only delete your own comments')
            return
        }

        try {
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', commentId)

            if (error) {
                toast.error('Failed to delete comment')
                console.error(error)
                return
            }

            toast.success('Comment deleted')
            setComments(comments.filter(c => c.id !== commentId))
        } catch (err) {
            toast.error('Failed to delete comment')
            console.error(err)
        }
    }

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
                    .select(`id, created_at, title, body, user_id, only_me, image, author:profile(display_name, avatar)`)
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

    useEffect(() => {
        if (blog) {
            fetchComments()
        }
    }, [blog, fetchComments])

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

                {blog.image && (
                    <div className="mt-8">
                        <img src={blog.image} alt={blog.title} className="w-full h-auto max-h-96 object-contain rounded-lg" />
                    </div>
                )}

                <div className="mt-8">
                    <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">
                        {blog.body}
                    </p>
                </div>

                {isAuthor && (
                    <footer className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
                        <EditBlogModalBtn blog={blog} onBlogUpdated={handleBlogUpdated} />
                        <ConfirmDeleteBlogBtn blogId={blog.id} onBlogDeleted={handleBlogDeleted} />
                    </footer>
                )}
            </article>


            <section className="bg-white rounded-lg shadow-md p-8 mt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Comments ({comments.length})
                </h2>

                <CommentForm
                    handleAddComment={handleAddComment}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    commentImageFile={commentImageFile}
                    setCommentImageFile={setCommentImageFile}
                    isSubmitting={isSubmitting}
                />

                {loadingComments ? (
                    <p className="text-slate-500 text-center py-4">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No comments yet. Be the first to comment!</p>
                ) : (
                    <Comments comments={comments} user={user} handleDeleteComment={handleDeleteComment} />
                )}
            </section>
        </div>
    )
}

export default ReadBlog