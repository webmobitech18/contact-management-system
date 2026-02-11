'use client';

import { FormEvent, useMemo, useState } from 'react';
import type { Contact, ContactInput } from '@/types/contact';
import { contactDefaults, contactFields, searchableFields } from './types';

type DashboardClientProps = {
  initialContacts: Contact[];
  sectors: string[];
  industries: string[];
};

export function DashboardClient({ initialContacts, sectors, industries }: DashboardClientProps) {
  const [contacts, setContacts] = useState(initialContacts);
  const [form, setForm] = useState<ContactInput>(contactDefaults);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');

  const visibleContacts = useMemo(
    () =>
      contacts.filter((contact) =>
        searchableFields.every(({ key }) => {
          const filter = filters[key];
          if (!filter) return true;
          const source = Array.isArray(contact[key]) ? (contact[key] as string[]).join(', ') : String(contact[key] ?? '');
          return source.toLowerCase().includes(filter.toLowerCase());
        })
      ),
    [contacts, filters]
  );

  const refresh = async () => {
    const response = await fetch('/api/contacts');
    const data = (await response.json()) as { contacts: Contact[] };
    setContacts(data.contacts);
  };

  const saveContact = async (event: FormEvent) => {
    event.preventDefault();
    const url = editingId ? `/api/contacts/${editingId}` : '/api/contacts';
    const method = editingId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const data = (await response.json()) as { message?: string };
      setStatus(data.message ?? 'Failed to save record.');
      return;
    }

    setStatus(editingId ? 'Contact updated successfully.' : 'Contact created successfully.');
    setForm(contactDefaults);
    setEditingId(null);
    await refresh();
  };

  const editContact = (contact: Contact) => {
    // Copy the selected row into the form so user can quickly update any field.
    setEditingId(contact.id);
    setForm({
      fullName: contact.fullName,
      mobileNumber: contact.mobileNumber,
      whatsappNumber: contact.whatsappNumber,
      personalEmail: contact.personalEmail,
      linkedinUrl: contact.linkedinUrl,
      organizationName: contact.organizationName,
      designation: contact.designation,
      officeLandline: contact.officeLandline,
      officialEmail: contact.officialEmail,
      institute: contact.institute,
      sectors: contact.sectors,
      industries: contact.industries
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeContact = async (id: string) => {
    const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      setStatus('Unable to delete contact.');
      return;
    }
    setStatus('Contact deleted successfully.');
    await refresh();
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-wrap">
      <header className="topbar panel">
        <img src="https://cms.hopinternational.org/wp-content/uploads/2026/02/HOP-Logo.svg" alt="HOP logo" className="logo small" />
        <div>
          <h1>Contact Management Dashboard</h1>
          <p className="muted">Create, update, delete, and filter every field from one place.</p>
        </div>
        <button onClick={logout} className="secondary">
          Logout
        </button>
      </header>

      <section className="panel">
        <h2>{editingId ? 'Update Contact' : 'Add New Contact'}</h2>
        <form className="grid-form" onSubmit={saveContact}>
          {contactFields.map((field) => (
            <label key={field.key}>
              {field.label}
              <input
                type={field.type ?? 'text'}
                value={form[field.key] as string}
                onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
              />
            </label>
          ))}

          {/* Checkbox options are fetched from API so CMS taxonomy changes reflect automatically in app. */}
          <fieldset>
            <legend>Sectors</legend>
            <div className="checkboxes">
              {sectors.map((name) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    checked={form.sectors.includes(name)}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        sectors: prev.sectors.includes(name) ? prev.sectors.filter((value) => value !== name) : [...prev.sectors, name]
                      }))
                    }
                  />
                  {name}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Industry</legend>
            <div className="checkboxes">
              {industries.map((name) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    checked={form.industries.includes(name)}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        industries: prev.industries.includes(name)
                          ? prev.industries.filter((value) => value !== name)
                          : [...prev.industries, name]
                      }))
                    }
                  />
                  {name}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="actions">
            <button type="submit">{editingId ? 'Update Contact' : 'Create Contact'}</button>
            {editingId ? (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(contactDefaults);
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
        {status ? <p className="muted">{status}</p> : null}
      </section>

      <section className="panel">
        <h2>Advanced Filters (All Fields)</h2>
        <div className="filter-grid">
          {searchableFields.map(({ key, label }) => (
            <label key={key}>
              {label}
              <input
                value={filters[key] ?? ''}
                onChange={(event) => setFilters((prev) => ({ ...prev, [key]: event.target.value }))}
                placeholder={`Filter by ${label}`}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Contacts ({visibleContacts.length})</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Mobile</th>
                <th>Whatsapp</th>
                <th>Personal Email</th>
                <th>LinkedIn</th>
                <th>Organization</th>
                <th>Designation</th>
                <th>Landline</th>
                <th>Official Email</th>
                <th>Institute</th>
                <th>Sectors</th>
                <th>Industries</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleContacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.fullName}</td>
                  <td>{contact.mobileNumber}</td>
                  <td>{contact.whatsappNumber}</td>
                  <td>{contact.personalEmail}</td>
                  <td>{contact.linkedinUrl}</td>
                  <td>{contact.organizationName}</td>
                  <td>{contact.designation}</td>
                  <td>{contact.officeLandline}</td>
                  <td>{contact.officialEmail}</td>
                  <td>{contact.institute}</td>
                  <td>{contact.sectors.join(', ')}</td>
                  <td>{contact.industries.join(', ')}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="secondary" onClick={() => editContact(contact)}>
                        Edit
                      </button>
                      <button type="button" className="danger" onClick={() => removeContact(contact.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!visibleContacts.length ? (
                <tr>
                  <td colSpan={13} className="empty">
                    No contacts found with current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
