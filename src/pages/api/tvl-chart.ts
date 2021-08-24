import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";

const redis = new Redis(process.env.HERMES_REDIS_URL);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case "GET": {
        let data = JSON.parse(await redis.get("tvl-chart"));
        return res.status(200).json(data || []);
      }
      default: {
        throw new Error("Method not allowed");
      }
    }
  } catch (err) {
    return res.status(400).send(err);
  }
}
