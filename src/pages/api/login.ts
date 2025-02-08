import type { NextApiRequest, NextApiResponse } from "next";

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    // Forward credentials to the ERP System Backend authentication endpoint
    const response = await fetch("http://68.183.213.111/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res
        .status(response.status)
        .json({ error: errorData.message || "Authentication failed" });
    }

    const data = await response.json();
    const { accessToken /*, refreshToken */ } = data;

    // Set the JWT token in an HttpOnly cookie
    // Adjust the Max-Age (expiration) as needed.
    res.setHeader("Set-Cookie", [
      `jwt=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${3600}`, // expires in 1 hour
      // Optionally, store a refresh token for token renewal.
      // `refreshToken=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${86400}`, // expires in 24 hours
    ]);

    return res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
