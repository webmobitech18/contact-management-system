import { DashboardClient } from './components/dashboard-client';
import { fetchContacts, fetchLookups } from '@/lib/wpgraphql';

export default async function DashboardPage() {
  try {
    const [contacts, lookups] = await Promise.all([fetchContacts(), fetchLookups()]);

    return <DashboardClient initialContacts={contacts} sectors={lookups.sectors} industries={lookups.industries} />;
  } catch (error) {
    return (
      <main className="centered-page">
        <section className="panel">
          <h1>Dashboard is not connected yet</h1>
          <p className="muted">
            {(error as Error).message}. Set <code>WPGRAPHQL_URL</code> in your <code>.env.local</code> file and confirm your
            WPGraphQL schema field names in <code>lib/wpgraphql.ts</code>.
          </p>
        </section>
      </main>
    );
  }
}
