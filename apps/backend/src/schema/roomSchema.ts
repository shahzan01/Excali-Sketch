import z from "zod";

export const createRoomSchema = z.object({
  slug: z.string().min(1, "Slug is required").max(50),
});
