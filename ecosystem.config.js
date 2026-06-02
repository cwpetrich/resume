// PM2 process definition. `next start` automatically loads env vars from a
// `.env.local` / `.env.production.local` file in this directory, so put your
// secrets there on the server (see README):
//
//   ADMIN_USERNAME, ADMIN_PASSWORD_HASH, AUTH_SECRET   (npm run set-password)
//   DATABASE_PATH   (optional; defaults to ./data/resume.db)
//
// The DB and env files live outside the deploy-synced paths, so edits and
// secrets persist across deploys.
module.exports = {
  apps: [
    {
      name: "resume",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
