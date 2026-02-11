# HOP Contact Management (Next.js + WPGraphQL)

This project provides:
- Login page
- Contact CRUD operations
- Filter inputs for every field
- WordPress integration via WPGraphQL + ACF

## 1) Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 2) Environment variables

```env
WPGRAPHQL_URL=https://your-wordpress-site/graphql
APP_LOGIN_USERNAME=admin
APP_LOGIN_PASSWORD=admin123
# Update if your GraphQL CPT name is different
WP_CONTACT_TYPE=contact
```

## 3) Notes about WPGraphQL + ACF mapping

Update `lib/wpgraphql.ts` if your ACF field group key/name differs.
The code uses:

- `contacts` query
- `contactFields` field group
- `createContact` / `updateContact` / `deleteContact` mutations

These names depend on your CPT + WPGraphQL config.
