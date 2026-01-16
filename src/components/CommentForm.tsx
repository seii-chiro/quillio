import { FaTrash } from "react-icons/fa"
import InputLabelGroup from "./input-label-goup";
import FormSubmitButton from "./styled-submit-btn";

type CommentFormProps = {
    handleAddComment: (e: React.FormEvent) => void;
    commentText: string;
    setCommentText: React.Dispatch<React.SetStateAction<string>>;
    commentImageFile: File | null;
    setCommentImageFile: React.Dispatch<React.SetStateAction<File | null>>;
    isSubmitting: boolean;
}

const CommentForm = ({
    handleAddComment,
    commentText,
    setCommentText,
    commentImageFile,
    setCommentImageFile,
    isSubmitting
}: CommentFormProps) => {
    return (
        <form onSubmit={handleAddComment} className="mb-8">
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                rows={3}
                disabled={isSubmitting}
            />

            <InputLabelGroup>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Add Image (optional)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCommentImageFile(e.target.files?.[0] || null)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-black"
                    disabled={isSubmitting}
                />
                {commentImageFile && (
                    <div className="mt-3 relative inline-block">
                        <img
                            src={URL.createObjectURL(commentImageFile)}
                            alt="Preview"
                            className="max-w-xs h-auto rounded-lg border object-contain border-slate-200"
                        />
                        <button
                            type="button"
                            onClick={() => setCommentImageFile(null)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700"
                            disabled={isSubmitting}
                        >
                            <FaTrash size={12} />
                        </button>
                    </div>
                )}
            </InputLabelGroup>

            <FormSubmitButton
                disabled={isSubmitting || !commentText.trim()}
            >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
            </FormSubmitButton>
        </form>
    )
}

export default CommentForm