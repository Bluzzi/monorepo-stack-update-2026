import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  appDirectory: "src",
  future: {
    v8_middleware: true,
  },
} satisfies Config;
