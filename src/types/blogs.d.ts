import type { Database } from "./supabase";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];
type BlogInsert = Database["public"]["Tables"]["blogs"]["Insert"];
type BlogUpdate = Database["public"]["Tables"]["blogs"]["Update"];

export type BlogWithAuthor = {
  body: string;
  created_at: string;
  id: number;
  only_me: boolean;
  title: string;
  user_id: string;
  image: string | null;
  author: {
    display_name: string | null;
    avatar: string | null;
  };
};

export type { Blog, BlogWithAuthor, BlogInsert, BlogUpdate };
