export const AUTH_COOKIE_NAME = 'cms_auth';

// These env values allow you to change login credentials without touching code.
export const LOGIN_USERNAME = process.env.APP_LOGIN_USERNAME ?? 'admin';
export const LOGIN_PASSWORD = process.env.APP_LOGIN_PASSWORD ?? 'admin123';

export const WPGRAPHQL_URL = process.env.WPGRAPHQL_URL ?? '';

// Change this if your WP custom post type has a different GraphQL singular name.
export const CONTACT_POST_TYPE = process.env.WP_CONTACT_TYPE ?? 'contact';
