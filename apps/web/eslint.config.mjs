import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "src/generated/prisma/**"
    ],
  },
  ...nextVitals
];

export default eslintConfig;
