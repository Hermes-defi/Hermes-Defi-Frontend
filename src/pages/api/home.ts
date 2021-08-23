import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";
import { loadHomePageData } from "api-services/home";

const redis = new Redis(process.env.HERMES_REDIS_URL);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case "GET": {
        let start = Date.now();
        let result: any = {};
        let cache = await redis.get("home");
        cache = JSON.parse(cache);

        if (cache) {
          console.log("loading from cache");
          result.data = cache;
          result.type = "redis";
          result.latency = Date.now() - start;

          return res.status(200).json(result);
        }

        console.log("loading from api");

        start = Date.now();
        const data = await loadHomePageData();

        result.data = data;
        result.type = "api";
        result.latency = Date.now() - start;

        // set cache to expire every 60 seconds
        redis.set("home", JSON.stringify(result.data), "EX", 120);
        return res.send(result);
      }
      default: {
        throw new Error("Method not allowed");
      }
    }
  } catch (err) {
    return res.status(400).send(err);
  }
}
