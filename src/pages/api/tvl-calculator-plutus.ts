import dayjs from "dayjs";
import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { getPlutusStats } from "api-services/home";

const redis = new Redis(process.env.HERMES_REDIS_URL);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET": {
      try {
        let tvlCache: any = await redis.get("tvl-chart-plutus");
        tvlCache = JSON.parse(tvlCache) || [];
        console.log({tvlCache});
        // push the new tvl to the array
        const currentTime = dayjs().toISOString();
        const { tvl, ...otherStats } = await getPlutusStats();

        
        tvlCache.push({ time: currentTime, value: tvl });
        if (tvlCache.length > 12) {
          tvlCache.shift();
        }

        // set cache to expire every 60 seconds
        redis.set("tvl-chart-plutus", JSON.stringify(tvlCache));
        redis.set("plutus-stats", JSON.stringify({ tvl, ...otherStats }));
        return res.json({
          success: true,
          tvl,
          otherStats
        });
      } catch (e) {
        return res.json({success: false, error: e.message});
      }
    }
    default: {
      return res.status(404).send("Page not found");
    }
  }
}

export default withSentry(handler);
