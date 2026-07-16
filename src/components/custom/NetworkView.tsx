"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTracker } from "@/hooks/useTracker";
import type { Contact, ContactStatus } from "@/types";
import { NetworkModal } from "./NetworkModal";
import { EditIcon, PlusIcon, TrashIcon } from "@/components/ui/Icons";

export function NetworkView() {
  const { contacts, addContact, updateContact, deleteContact } = useTracker();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddClick = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: Partial<Contact>) => {
    if (editingContact) {
      updateContact(editingContact.id, data);
    } else {
      addContact(data as Omit<Contact, "id" | "createdAt" | "updatedAt">);
    }
    setIsModalOpen(false);
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const statusColors: Record<ContactStatus, string> = {
    "To Contact": "bg-secondary text-muted-foreground",
    Contacted: "bg-blue-900/50 text-blue-300 border-blue-800",
    Replied: "bg-yellow-900/50 text-yellow-300 border-yellow-800",
    Connected: "bg-green-900/50 text-green-300 border-green-800",
    Ghosted: "bg-red-900/50 text-red-300 border-red-800",
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-2xl font-bold text-foreground">
            Network
          </h2>
          <Input
            placeholder="Search contacts..."
            className="max-w-xs bg-card border-border text-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-500 text-white"
        >
          <PlusIcon className="w-4 h-4 mr-2" /> Add Contact
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow className="border-border hover:bg-secondary dark:hover:bg-secondary">
              <TableHead className="text-muted-foreground w-[200px]">
                Name
              </TableHead>
              <TableHead className="text-muted-foreground">
                Role & Company
              </TableHead>
              <TableHead className="text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="text-muted-foreground">
                Links
              </TableHead>
              <TableHead className="text-muted-foreground text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow className="border-border hover:bg-secondary dark:hover:bg-secondary">
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-muted-foreground"
                >
                  No contacts found. Start building your network!
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  className="border-border hover:bg-secondary dark:hover:bg-secondary transition-colors"
                >
                  <TableCell className="font-medium text-muted-foreground">
                    {contact.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex flex-col">
                      <span>{contact.role}</span>
                      <span className="text-xs text-muted-foreground">
                        {contact.company}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border ${statusColors[contact.status]} bg-opacity-10 dark:bg-opacity-20`}
                    >
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {contact.email && (
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                          target="_blank"
                        >
                          Email
                        </a>
                      )}
                      {contact.linkedin && (
                        <a
                          href={contact.linkedin}
                          className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(contact)}
                        className="h-8 w-8 text-muted-foreground hover:text-muted-foreground dark:hover:text-muted-foreground"
                      >
                        <EditIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteContact(contact.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-red-500 dark:hover:text-red-400"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <NetworkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingContact || undefined}
      />
    </div>
  );
}
