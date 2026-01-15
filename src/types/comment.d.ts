import type { Database } from "./supabase";
import type { Profile } from "./profile";

type Comment = Database["public"]["Tables"]["comments"]["Row"];
type CommentInsert = Database["public"]["Tables"]["comments"]["Insert"];
type CommentUpdate = Database["public"]["Tables"]["comments"]["Update"];

type CommentWithAuthor = Comment & {
  author: Profile | null;
};

export type { Comment, CommentInsert, CommentUpdate, CommentWithAuthor };
