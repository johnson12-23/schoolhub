import serverless from "serverless-http";
import app from "../src/app.js";

const handler = serverless(app);

// Lightweight fast-path for health check to avoid cold-start timeouts
export default async function (req, res) {
	try {
		const url = req?.raw?.url || req?.path || (req && req.url) || "";
		const path = typeof url === "string" ? url.split("?")[0] : "";
		if (path === "/api/health" || path === "/health" || path === "/") {
			return res
				? res.status(200).json({ status: "ok", mode: process.env.SUPABASE_URL ? "supabase" : "demo" })
				: { statusCode: 200, body: JSON.stringify({ status: "ok", mode: process.env.SUPABASE_URL ? "supabase" : "demo" }), headers: { "Content-Type": "application/json" } };
		}
	} catch (e) {
		// fall through to full handler on any unexpected inspection error
	}

	return handler(req, res);
}
