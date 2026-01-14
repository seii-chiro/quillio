import type { BlogInsert, BlogWithAuthor } from "../types/blogs"
import { useState } from "react"
import StyledInput from "./styled-input"
import InputLabelGroup from "./input-label-goup"
import { supabase } from "../supabaseClient"
import { toast } from "sonner"
import FormSubmitButton from "./styled-submit-btn"
import { useAppSelector } from "../hooks/store-hooks"

type CreateBlogProps = {
    id?: number;
    title?: string;
    body?: string;
    only_me?: boolean;
    image?: string | null;
    isEditing?: boolean;
    onClose: () => void;
    onBlogCreated?: (blog: BlogWithAuthor) => void;
    onBlogUpdated?: (blog: BlogWithAuthor) => void;
}

const BlogForm = ({ id, title = "", body = "", only_me = false, image = null, isEditing = false, onClose, onBlogCreated, onBlogUpdated }: CreateBlogProps) => {
    const [blogEntry, setBlogEntry] = useState<BlogInsert>({ title: title, body: body, only_me: only_me, image: image })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(image)
    const user = useAppSelector((state) => state.user.value)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file')
                return
            }

            // 10MB
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Image size must be less than 10MB')
                return
            }

            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const uploadImage = async (file: File): Promise<string | null> => {
        if (!user) {
            toast.error('User not authenticated')
            return null
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`
        const filePath = `private/${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('blog_images')
            .upload(filePath, file)

        if (uploadError) {
            toast.error(`Image upload failed: ${uploadError.message}`)
            return null
        }

        const { data, error: urlError } = await supabase.storage
            .from('blog_images')
            .createSignedUrl(filePath, 60 * 60 * 24 * 365)

        if (urlError || !data) {
            toast.error(`Failed to generate image URL: ${urlError?.message}`)
            return null
        }

        return data.signedUrl
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!blogEntry.title.trim() || !blogEntry.body.trim()) {
            toast.error('Please provide a title and body for your blog')
            return
        }

        setIsSubmitting(true)

        let imageUrl = blogEntry.image

        if (imageFile) {
            imageUrl = await uploadImage(imageFile)
            if (!imageUrl) {
                setIsSubmitting(false)
                return
            }
        }

        if (isEditing) {
            if (id === undefined || id === null) {
                toast.error("Blog ID is missing for editing")
                setIsSubmitting(false)
                return
            }

            const { data, error } = await supabase
                .from('blogs')
                .update({ "title": blogEntry.title, "body": blogEntry.body, "only_me": blogEntry.only_me, "image": imageUrl })
                .eq('id', id)
                .select(`id, created_at, title, body, user_id, only_me, image, author:profile(display_name, avatar)`)
                .single()

            setIsSubmitting(false)
            if (error) {
                toast.error(error.message)
            } else {
                toast.success("Blog updated successfully")
                setBlogEntry({ title: "", body: "" })
                if (data && onBlogUpdated) {
                    onBlogUpdated(data as BlogWithAuthor)
                }
                onClose()
            }
            return
        } else {
            const { data, error } = await supabase
                .from('blogs')
                .insert([
                    {
                        title: blogEntry?.title || "",
                        body: blogEntry?.body || "",
                        image: imageUrl,
                        only_me: blogEntry?.only_me || false
                    },
                ])
                .select(`id, created_at, title, body, user_id, only_me, image, author:profile(display_name, avatar)`)
                .single()

            setIsSubmitting(false)
            if (error) {
                toast.error(error.message)
            } else {
                toast.success("Blog created successfully")
                setBlogEntry({ title: "", body: "" })
                if (data && onBlogCreated) {
                    onBlogCreated(data as BlogWithAuthor)
                }
                onClose()
            }
        }

    }

    const btnLabel = isEditing ? "Update Blog" : "Create Blog"
    const btnLabelSubmitting = isEditing ? "Updating…" : "Creating…"


    return (
        <div className="w-full max-w-2xl bg-white rounded-md shadow p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Write something up</h3>
                <p className="text-sm text-slate-500">Share your thoughts with the world</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
                <InputLabelGroup>
                    <label htmlFor="blog-title" className="text-sm font-medium text-slate-700">Title</label>
                    <StyledInput
                        id="blog-title"
                        placeholder="Short, descriptive title"
                        value={blogEntry.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setBlogEntry({ ...blogEntry, title: e.target.value || "" })
                        }}
                    />
                </InputLabelGroup>

                <InputLabelGroup>
                    <label htmlFor="blog-image" className="text-sm font-medium text-slate-700">Cover Image (optional)</label>
                    <input
                        type="file"
                        id="blog-image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-black"
                    />
                    {imagePreview && (
                        <div className="mt-2 relative">
                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-md" />
                            <button
                                type="button"
                                onClick={() => {
                                    setImageFile(null)
                                    setImagePreview(null)
                                    setBlogEntry({ ...blogEntry, image: null })
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </InputLabelGroup>

                <InputLabelGroup>
                    <label htmlFor="blog-body" className="text-sm font-medium text-slate-700">Body</label>
                    <textarea
                        className="w-full min-h-32 border border-gray-200 rounded-md px-3 py-2 resize-y focus:outline-none focus:ring-0 focus:border-black"
                        id="blog-body"
                        placeholder="Write your blog here..."
                        value={blogEntry.body}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                            setBlogEntry({ ...blogEntry, body: e.target.value || "" })
                        }}
                    />
                    <div className="flex justify-between items-center mt-1 text-xs text-slate-400">
                        <span>{blogEntry.body.length} chars</span>
                        <span className="flex gap-1 items-center">
                            <input type="checkbox" checked={blogEntry.only_me} onChange={(e) => setBlogEntry({ ...blogEntry, only_me: e.target.checked })} />
                            <span className="ml-1">Private</span>
                        </span>
                    </div>
                </InputLabelGroup>
                <div className="flex justify-end">
                    <FormSubmitButton>
                        {
                            isSubmitting ? btnLabelSubmitting : btnLabel
                        }
                    </FormSubmitButton>
                </div>
            </form>
        </div>
    )
}

export default BlogForm