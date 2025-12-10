import { defineConfig } from 'drizzle-kit';
import { D1Helper } from '@nerdfolio/drizzle-d1-helpers';

const base_dir = "./src/d1/static_content"
const crawledDbHelper = D1Helper.get('DB_STATIC_CONTENT');
const isProd = () => process.env.NODE_ENV === 'production';

const getCredentials = () => {
  const prod = {
    driver: 'd1-http',
    dbCredentials: {
      ...crawledDbHelper.withCfCredentials(
        process.env.CLOUDFLARE_ACCOUNT_ID,
        process.env.CLOUDFLARE_D1_TOKEN,
      ).proxyCredentials,
    },
  };

  const dev = {
    dbCredentials: {
      url: crawledDbHelper.sqliteLocalFileCredentials.url,
    },
  };
  return isProd() ? prod : dev;
};

export default defineConfig({
  out: `${base_dir}/migrations`,
  schema: `${base_dir}/schema/*`,
  dialect: 'sqlite',
  ...getCredentials(),
});
