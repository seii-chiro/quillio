import type { User } from "@supabase/supabase-js";
import type { CommentWithAuthor } from "../types/comment"
import { formatDate } from "../utils/formatDate";
import { formatDateShort } from "../utils/formatDateShort";
import { FaTrash, FaEdit } from "react-icons/fa";
import CommentForm from "./CommentForm";

type CommentsProps = {
    comments: CommentWithAuthor[];
    user: User | null;
    handleDeleteComment: (commentId: number) => void;
    editingCommentId: number | null;
    editCommentText: string;
    setEditCommentText: React.Dispatch<React.SetStateAction<string>>;
    editCommentImageFile: File | null;
    setEditCommentImageFile: React.Dispatch<React.SetStateAction<File | null>>;
    handleStartEditComment: (commentId: number, currentText: string) => void;
    handleCancelEdit: () => void;
    handleUpdateComment: (commentId: number) => void;
    isSubmitting: boolean;
}

const Comments = ({ 
    comments, 
    user, 
    handleDeleteComment,
    editingCommentId,
    editCommentText,
    setEditCommentText,
    editCommentImageFile,
    setEditCommentImageFile,
    handleStartEditComment,
    handleCancelEdit,
    handleUpdateComment,
    isSubmitting
}: CommentsProps) => {
    return (
        <div className="space-y-4">
            {comments.map((comment) => {
                const isCommentAuthor = user?.id === comment.profile_id
                const commentAuthorName = comment.author?.display_name ?? 'Unknown'

                return (
                    <div
                        key={comment.id}
                        className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-semibold text-slate-900">
                                        {commentAuthorName}
                                    </span>
                                    <span className="hidden md:block text-sm text-slate-500">
                                        {formatDate(comment.created_at)}
                                    </span>
                                    <span className="md:hidden text-sm text-slate-500">
                                        {formatDateShort(comment.created_at)}
                                    </span>
                                </div>
                                
                                {editingCommentId === comment.id ? (
                                    <CommentForm
                                        handleAddComment={(e) => {
                                            e.preventDefault();
                                            handleUpdateComment(comment.id);
                                        }}
                                        commentText={editCommentText}
                                        setCommentText={setEditCommentText}
                                        commentImageFile={editCommentImageFile}
                                        setCommentImageFile={setEditCommentImageFile}
                                        isSubmitting={isSubmitting}
                                        isEditMode={true}
                                        onCancel={handleCancelEdit}
                                    />
                                ) : (
                                    <>
                                        <p className="text-slate-700 whitespace-pre-wrap">
                                            {comment.comment}
                                        </p>
                                        {comment.comment_image && (
                                            <img
                                                src={comment.comment_image}
                                                alt="Comment attachment"
                                                className="mt-3 max-w-md w-full h-auto rounded-lg border border-slate-200"
                                            />
                                        )}
                                    </>
                                )}
                            </div>

                            {isCommentAuthor && editingCommentId !== comment.id && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleStartEditComment(comment.id, comment.comment)}
                                        className="text-sky-600 hover:text-sky-700 p-2 hover:bg-sky-50 rounded transition-colors"
                                        title="Edit comment"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                                        title="Delete comment"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Comments