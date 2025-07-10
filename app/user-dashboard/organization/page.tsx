"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Eye, Users } from "lucide-react"

interface OrgForm {
  organizationName: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  organizationType: string;
}

interface OrganizationsSectionProps {
  organizations: any[];
  orgsLoading: boolean;
  orgsError: string | null;
  onAddOrganization: (
    orgForm: OrgForm,
    setAddOrgOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setOrgForm: React.Dispatch<React.SetStateAction<OrgForm>>,
    setAddOrgError: React.Dispatch<React.SetStateAction<string>>
  ) => Promise<void>;
}

export default function OrganizationsSection({ organizations, orgsLoading, orgsError, onAddOrganization }: OrganizationsSectionProps) {
  const [addOrgOpen, setAddOrgOpen] = useState(false)
  const [addOrgLoading, setAddOrgLoading] = useState(false)
  const [addOrgError, setAddOrgError] = useState("")
  const [orgForm, setOrgForm] = useState({
    organizationName: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    organizationType: "",
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Organizations</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">Total: {organizations.length} organizations</div>
          <Dialog open={addOrgOpen} onOpenChange={setAddOrgOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setAddOrgError("")}>Add Organization</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Organization</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setAddOrgLoading(true)
                  setAddOrgError("")
                  try {
                    await onAddOrganization(orgForm, setAddOrgOpen, setOrgForm, setAddOrgError)
                  } finally {
                    setAddOrgLoading(false)
                  }
                }}
              >
                <div>
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    name="organizationName"
                    placeholder="Enter name"
                    required
                    value={orgForm.organizationName}
                    onChange={e => setOrgForm(f => ({ ...f, organizationName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="orgDescription">Description</Label>
                  <Input
                    id="orgDescription"
                    name="description"
                    placeholder="Enter description"
                    value={orgForm.description}
                    onChange={e => setOrgForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="orgType">Type</Label>
                  <Input
                    id="orgType"
                    name="organizationType"
                    placeholder="e.g. Club, Company, NGO"
                    value={orgForm.organizationType}
                    onChange={e => setOrgForm(f => ({ ...f, organizationType: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="orgEmail">Contact Email</Label>
                  <Input
                    id="orgEmail"
                    name="contactEmail"
                    type="email"
                    placeholder="Enter email"
                    value={orgForm.contactEmail}
                    onChange={e => setOrgForm(f => ({ ...f, contactEmail: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="orgPhone">Contact Phone</Label>
                  <Input
                    id="orgPhone"
                    name="contactPhone"
                    placeholder="Enter phone number"
                    value={orgForm.contactPhone}
                    onChange={e => setOrgForm(f => ({ ...f, contactPhone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="orgAddress">Address</Label>
                  <Input
                    id="orgAddress"
                    name="address"
                    placeholder="Enter address"
                    value={orgForm.address}
                    onChange={e => setOrgForm(f => ({ ...f, address: e.target.value }))}
                  />
                </div>
                {addOrgError && (
                  <div className="text-red-600 text-sm">{addOrgError}</div>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={addOrgLoading}>
                    {addOrgLoading ? "Adding..." : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {orgsLoading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
          <div className="text-blue-600 font-semibold">Loading organizations...</div>
        </div>
      ) : orgsError ? (
        <div className="text-red-500">{orgsError}</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Organization</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Description</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Type</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((org) => (
                    <tr key={org.organizationId} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{org.organizationName}</h4>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{org.description}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{org.organizationType}</td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Users className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
