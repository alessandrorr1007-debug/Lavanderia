import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Los enlaces de correo llevan tokens: no registrar sus URLs en desarrollo.
  logging: { incomingRequests: { ignore: [/\/auth\/confirm/] }, fetches: { fullUrl: false } },
};
export default nextConfig;
