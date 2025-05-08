// This file is used to configure Next.js build behavior at runtime
module.exports = {
  // Disable static optimization for certain paths
  unstable_skipMiddlewareUrlNormalize: true,
  // Prevent server-side rendering of pages that use browser APIs
  unstable_runtimeJS: true,
  // Tell Next.js to use client-side navigation for all pages
  unstable_useDeploymentId: true,
  // Add necessary polyfills
  future: {
    webpack5: true,
  },
};
