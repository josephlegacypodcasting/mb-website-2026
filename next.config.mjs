/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root. Without this, Next walks up the tree looking for a
  // lockfile and picks the wrong directory whenever this repo sits under one.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
