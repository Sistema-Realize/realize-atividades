import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function me(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.decode(token);
    res.status(200).json({ user: decoded });
  } catch (error) {
    res.status(500).json({ error: "Failed to decode token" });
  }
}
