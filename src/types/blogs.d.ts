import type { Database } from "./supabase";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];
type BlogInsert = Database["public"]["Tables"]["blogs"]["Insert"];
type BlogUpdate = Database["public"]["Tables"]["blogs"]["Update"];

export type { Blog, BlogInsert, BlogUpdate };
