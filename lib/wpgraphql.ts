import { CONTACT_POST_TYPE, WPGRAPHQL_URL } from './constants';
import type { Contact, ContactInput } from '@/types/contact';

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const ensureEndpoint = () => {
  if (!WPGRAPHQL_URL) {
    throw new Error('WPGRAPHQL_URL is not configured.');
  }
};

export async function wpRequest<T>(query: string, variables?: Record<string, unknown>) {
  ensureEndpoint();

  const response = await fetch(WPGRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as GraphQLResponse<T>;
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((err) => err.message).join(', '));
  }

  if (!payload.data) {
    throw new Error('No GraphQL data returned.');
  }

  return payload.data;
}

// IMPORTANT: Update these field names if your ACF keys differ in WPGraphQL schema.
const CONTACT_FIELDS_FRAGMENT = `
  id
  databaseId
  title
  contactFields {
    fullName
    mobileNumber
    whatsappNumber
    personalEmail
    linkedinUrl
    organizationName
    designation
    officeLandline
    officialEmail
    institute
    sectors
    industries
  }
`;

const CONTACT_NODE_QUERY = `
  query ContactList {
    contacts(first: 200) {
      nodes {
        ${CONTACT_FIELDS_FRAGMENT}
      }
    }
  }
`;

const LOOKUPS_QUERY = `
  query ContactLookups {
    sectors: terms(where: {taxonomy: SECTOR, hideEmpty: false}, first: 300) {
      nodes { name }
    }
    industries: terms(where: {taxonomy: INDUSTRY, hideEmpty: false}, first: 300) {
      nodes { name }
    }
  }
`;

type ContactNode = {
  id: string;
  databaseId: number;
  title?: string | null;
  contactFields?: Partial<ContactInput> | null;
};

const mapContact = (node: ContactNode): Contact => ({
  id: String(node.databaseId),
  fullName: node.contactFields?.fullName ?? node.title ?? '',
  mobileNumber: node.contactFields?.mobileNumber ?? '',
  whatsappNumber: node.contactFields?.whatsappNumber ?? '',
  personalEmail: node.contactFields?.personalEmail ?? '',
  linkedinUrl: node.contactFields?.linkedinUrl ?? '',
  organizationName: node.contactFields?.organizationName ?? '',
  designation: node.contactFields?.designation ?? '',
  officeLandline: node.contactFields?.officeLandline ?? '',
  officialEmail: node.contactFields?.officialEmail ?? '',
  institute: node.contactFields?.institute ?? '',
  sectors: node.contactFields?.sectors ?? [],
  industries: node.contactFields?.industries ?? []
});

export async function fetchContacts() {
  const data = await wpRequest<{ contacts: { nodes: ContactNode[] } }>(CONTACT_NODE_QUERY);
  return data.contacts.nodes.map(mapContact);
}

export async function fetchLookups() {
  const data = await wpRequest<{
    sectors: { nodes: Array<{ name: string }> };
    industries: { nodes: Array<{ name: string }> };
  }>(LOOKUPS_QUERY);

  return {
    sectors: data.sectors.nodes.map((n) => n.name),
    industries: data.industries.nodes.map((n) => n.name)
  };
}

const buildInput = (payload: ContactInput) => ({
  title: payload.fullName,
  contactFields: payload
});

export async function createContact(payload: ContactInput) {
  const mutation = `
    mutation CreateContact($input: Create${CONTACT_POST_TYPE.charAt(0).toUpperCase() + CONTACT_POST_TYPE.slice(1)}Input!) {
      create${CONTACT_POST_TYPE.charAt(0).toUpperCase() + CONTACT_POST_TYPE.slice(1)}(input: $input) {
        ${CONTACT_POST_TYPE} {
          ${CONTACT_FIELDS_FRAGMENT}
        }
      }
    }
  `;

  const data = await wpRequest<Record<string, Record<string, ContactNode>>>(mutation, {
    input: buildInput(payload)
  });

  const created = data[`create${CONTACT_POST_TYPE.charAt(0).toUpperCase() + CONTACT_POST_TYPE.slice(1)}`]?.[CONTACT_POST_TYPE];

  if (!created) {
    throw new Error('Unable to create contact.');
  }

  return mapContact(created);
}

export async function updateContact(id: string, payload: ContactInput) {
  const mutationName = `${CONTACT_POST_TYPE.charAt(0).toUpperCase() + CONTACT_POST_TYPE.slice(1)}`;
  const mutation = `
    mutation UpdateContact($input: Update${mutationName}Input!) {
      update${mutationName}(input: $input) {
        ${CONTACT_POST_TYPE} {
          ${CONTACT_FIELDS_FRAGMENT}
        }
      }
    }
  `;

  const data = await wpRequest<Record<string, Record<string, ContactNode>>>(mutation, {
    input: { id, ...buildInput(payload) }
  });

  const updated = data[`update${mutationName}`]?.[CONTACT_POST_TYPE];
  if (!updated) {
    throw new Error('Unable to update contact.');
  }

  return mapContact(updated);
}

export async function deleteContact(id: string) {
  const mutationName = `${CONTACT_POST_TYPE.charAt(0).toUpperCase() + CONTACT_POST_TYPE.slice(1)}`;
  const mutation = `
    mutation DeleteContact($input: Delete${mutationName}Input!) {
      delete${mutationName}(input: $input) {
        deletedId
      }
    }
  `;

  await wpRequest(mutation, {
    input: { id, forceDelete: true }
  });
}
