import type { BlogInsert } from "../types/blogs"
import { useState } from "react"
import StyledInput from "./styled-input"
import InputLabelGroup from "./input-label-goup"
import { supabase } from "../supabaseClient"
import { toast } from "sonner"
import FormSubmitButton from "./styled-submit-btn"
import { reloadWindow } from "../utils/reloadWindow"

type CreateBlogProps = {
    id?: number;
    title?: string;
    body?: string;
    only_me?: boolean;
    isEditing?: boolean;
    onClose: () => void;
}

const BlogForm = ({ id, title = "", body = "", only_me = false, isEditing = false, onClose }: CreateBlogProps) => {
    const [blogEntry, setBlogEntry] = useState<BlogInsert>({ title: title, body: body, only_me: only_me })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!blogEntry.title.trim() || !blogEntry.body.trim()) {
            toast.error('Please provide a title and body for your blog')
            return
        }

        setIsSubmitting(true)

        if (isEditing) {
            if (id === undefined || id === null) {
                toast.error("Blog ID is missing for editing")
                setIsSubmitting(false)
                return
            }

            const { error } = await supabase
                .from('blogs')
                .update({ "title": blogEntry.title, "body": blogEntry.body, "only_me": blogEntry.only_me })
                .eq('id', id)
                .select()

            setIsSubmitting(false)
            if (error) {
                toast.error(error.message)
            } else {
                toast.success("Blog updated successfully")
                setBlogEntry({ title: "", body: "" })
                onClose()
                reloadWindow()
            }
            return
        } else {
            const { error } = await supabase
                .from('blogs')
                .insert([
                    { title: blogEntry?.title || "", body: blogEntry?.body || "" },
                ])
                .select()

            if (error) {
                toast.error(error.message)
            } else {
                setIsSubmitting(false)
                toast.success("Blog created successfully")
                setBlogEntry({ title: "", body: "" })
                onClose()
                reloadWindow()
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