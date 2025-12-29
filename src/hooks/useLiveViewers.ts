import { useState, useEffect } from "react";

const UPSTASH_URL = import.meta.env.VITE_UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN;

const VISITOR_KEY_PREFIX = "visitor:";
const TOTAL_VISITS_KEY = "total_visits";
const COUNTRY_KEY_PREFIX = "country:";
const TTL_SECONDS = 30;

const generateVisitorId = () => {
  let id = sessionStorage.getItem("visitor_id");
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem("visitor_id", id);
  }
  return id;
};

const isNewVisit = () => {
  const visited = sessionStorage.getItem("has_visited");
  if (!visited) {
    sessionStorage.setItem("has_visited", "true");
    return true;
  }
  return false;
};

const getCountryCode = async (): Promise<string | null> => {
  // Check if we already have the country cached
  const cached = sessionStorage.getItem("visitor_country");
  if (cached) return cached;

  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    const country = data.country_code || null;
    if (country) {
      sessionStorage.setItem("visitor_country", country);
    }
    return country;
  } catch {
    return null;
  }
};

const countryCodeToFlag = (code: string): string => {
  // Only convert valid 2-letter country codes
  if (!code || code.length !== 2) return code;

  try {
    const codePoints = code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return code;
  }
};

const redisCommand = async (command: string[]) => {
  const response = await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  return response.json();
};

export type CountryStats = { code: string; flag: string; count: number };

export const useLiveViewers = () => {
  const [liveCount, setLiveCount] = useState<number | null>(null);
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [topCountries, setTopCountries] = useState<CountryStats[]>([]);

  useEffect(() => {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      console.warn("Upstash credentials not configured");
      return;
    }

    const visitorId = generateVisitorId();
    const visitorKey = `${VISITOR_KEY_PREFIX}${visitorId}`;

    const init = async () => {
      try {
        // Get country and increment country counter
        const country = await getCountryCode();
        if (country && isNewVisit()) {
          await redisCommand(["INCR", `${COUNTRY_KEY_PREFIX}${country}`]);
          const incrResult = await redisCommand(["INCR", TOTAL_VISITS_KEY]);
          setTotalVisits(incrResult.result);
        } else {
          const getResult = await redisCommand(["GET", TOTAL_VISITS_KEY]);
          setTotalVisits(Number(getResult.result) || 0);
        }

        // Get top countries
        await fetchTopCountries();
      } catch (e) {
        console.error("Error initializing visits:", e);
      }
    };

    const fetchTopCountries = async () => {
      try {
        const keysResult = await redisCommand(["KEYS", `${COUNTRY_KEY_PREFIX}*`]);
        const countryKeys = keysResult.result || [];

        if (countryKeys.length === 0) {
          setTopCountries([]);
          return;
        }

        // Get all country counts
        const counts: CountryStats[] = [];
        for (const key of countryKeys) {
          const countResult = await redisCommand(["GET", key]);
          const code = key.replace(COUNTRY_KEY_PREFIX, "");
          counts.push({
            code,
            flag: countryCodeToFlag(code),
            count: Number(countResult.result) || 0,
          });
        }

        // Sort by count and take top 3
        counts.sort((a, b) => b.count - a.count);
        setTopCountries(counts.slice(0, 3));
      } catch (e) {
        console.error("Error fetching top countries:", e);
      }
    };

    const heartbeat = async () => {
      try {
        // Set this visitor's key with TTL
        await redisCommand(["SETEX", visitorKey, String(TTL_SECONDS), "1"]);

        // Count all active visitors
        const keysResult = await redisCommand([
          "KEYS",
          `${VISITOR_KEY_PREFIX}*`,
        ]);
        const activeCount = keysResult.result?.length || 1;
        setLiveCount(activeCount);
      } catch (e) {
        console.error("Error tracking viewers:", e);
      }
    };

    // Initialize
    init();
    heartbeat();

    // Send heartbeat every 20 seconds
    const interval = setInterval(heartbeat, 20000);

    return () => clearInterval(interval);
  }, []);

  return { liveCount, totalVisits, topCountries };
};
