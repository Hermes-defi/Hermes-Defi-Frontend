import dayjs from "dayjs";
import Redis from "ioredis";
import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { getHermesStats } from "api-services/home";

const redis = new Redis(process.env.HERMES_REDIS_URL);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET": {
      try {
        let tvlCache: any = await redis.get("tvl-chart");
        tvlCache = JSON.parse(tvlCache) || [];

        // push the new tvl to the array
        const currentTime = dayjs().toISOString();
        const { tvl } = await getHermesStats();

        tvlCache.push({ time: currentTime, value: tvl });

        // set cache to expire every 60 seconds
        redis.set("tvl-chart", JSON.stringify(tvlCache));
        return res.send(true);
      } catch (e) {
        return res.send(e.message);
      }
    }
    default: {
      return res.status(404).send("Page not found");
    }
  }
}

export default withSentry(handler);
