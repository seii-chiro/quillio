import type { Database } from "./supabase";

type Like = Database["public"]["Tables"]["likes"]["Row"];
type LikeInsert = Database["public"]["Tables"]["likes"]["Insert"];
type LikeUpdate = Database["public"]["Tables"]["likes"]["Update"];

export type { Like, LikeInsert, LikeUpdate };
