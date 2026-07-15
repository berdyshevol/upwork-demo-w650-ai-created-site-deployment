import type { NextConfig } from "next";

// This project sits inside a parent folder that has its own lockfile, which Next
// would otherwise infer as the workspace root — pin both roots to this directory
// so dev and the Vercel build only ever trace these files.
const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  outputFileTracingExcludes: {
    "*": ["./stub/**"],
  },
};

export default nextConfig;
