import type { NextConfig } from "next";

/**
 * Parse allowed dev origins from environment variable
 * Defaults to localhost if not configured
 */
const getAllowedDevOrigins = (): string[] => {
  const envOrigins = process.env.ALLOWED_DEV_ORIGINS;
  if (envOrigins) {
    return envOrigins.split(",").map((origin) => origin.trim()).filter(Boolean);
  }
  return ["127.0.0.1", "localhost"];
};

const nextConfig: NextConfig = {
  allowedDevOrigins: getAllowedDevOrigins(),
};

export default nextConfig;
