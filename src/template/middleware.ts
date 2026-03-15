export const middlewareTemplate = `
import { createNextProxy } from "@victorcassiano/next-proxy";

export const middleware = createNextProxy();

export const config = {
  matcher: ["/((?!_next|fonts|examples|[\\\\w-]+\\\\.\\\\w+).*)"],
};
`;

export const proxyTemplate = middlewareTemplate;