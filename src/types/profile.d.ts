import type { Database } from "./supabase";

type Profile = Database["public"]["Tables"]["profile"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profile"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profile"]["Update"];

export type { Profile, ProfileInsert, ProfileUpdate };
