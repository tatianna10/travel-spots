import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3030;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS || 12);

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");
