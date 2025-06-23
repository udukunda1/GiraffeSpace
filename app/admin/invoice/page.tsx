"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Eye, Edit, Trash2, FileText, DollarSign, CheckCircle, XCircle } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock invoice data
const invoices = [
  { id: "1", customer: "Alice", amount: 500, status: "Paid", date: "2024-06-01" },
  { id: "2", customer: "Bob", amount: 300, status: "Unpaid", date: "2024-06-02" },
  { id: "3", customer: "Charlie", amount: 700, status: "Paid", date: "2024-06-03" },
  { id: "4", customer: "Diana", amount: 200, status: "Overdue", date: "2024-06-04" },
]

function InvoiceForm({ initialData, onSubmit, loading, mode }: {
  initialData?: any,
  onSubmit: (data: any) => void,
  loading: boolean,
  mode: 'add' | 'edit',
}) {
  const [form, setForm] = useState({
    customer: initialData?.customer || '',
    amount: initialData?.amount ? String(initialData.amount) : '',
    status: initialData?.status || 'Paid',
    date: initialData?.date || '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    onSubmit({ ...form, amount: Number(form.amount) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Customer" name="customer" value={form.customer} onChange={handleChange} required />
      <Input type="number" placeholder="Amount" name="amount" value={form.amount} onChange={handleChange} required min={1} />
      <Select value={form.status} onValueChange={val => setForm(f => ({ ...f, status: val }))} required>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Paid">Paid</SelectItem>
          <SelectItem value="Unpaid">Unpaid</SelectItem>
          <SelectItem value="Overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>
      <Input type="date" name="date" value={form.date} onChange={handleChange} required />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>{loading ? (mode === 'add' ? 'Adding...' : 'Saving...') : (mode === 'add' ? 'Add Invoice' : 'Save Changes')}</Button>
      </DialogFooter>
    </form>
  )
}

export default function AdminInvoice() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const itemsPerPage = 10
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [editInvoice, setEditInvoice] = useState<any>(null)

  // Statistics
  const stats = {
    totalInvoices: invoices.length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
    paid: invoices.filter(i => i.status === "Paid").length,
    unpaid: invoices.filter(i => i.status === "Unpaid").length,
    overdue: invoices.filter(i => i.status === "Overdue").length,
  }

  // Filtered invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage)

  const handleAdd = async (data: any) => {
    setLoading(true)
    // TODO: Add invoice logic
    setTimeout(() => {
      setLoading(false)
      setAddOpen(false)
      // Optionally update invoice list
    }, 1000)
  }
  const handleEdit = async (data: any) => {
    setLoading(true)
    // TODO: Edit invoice logic
    setTimeout(() => {
      setLoading(false)
      setEditOpen(null)
      // Optionally update invoice list
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Invoice Management</h2>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button>Add New Invoice</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Invoice</DialogTitle>
                    </DialogHeader>
                    <InvoiceForm mode="add" loading={loading} onSubmit={handleAdd} />
                  </DialogContent>
                </Dialog>
              </div>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Invoices</p>
                        <p className="text-2xl font-bold">{stats.totalInvoices}</p>
                        <p className="text-sm text-gray-500 mt-1">Paid: {stats.paid} • Unpaid: {stats.unpaid} • Overdue: {stats.overdue}</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold">${stats.totalAmount}</p>
                        <p className="text-sm text-gray-500 mt-1">All invoices</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Paid Invoices</p>
                        <p className="text-2xl font-bold">{stats.paid}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Overdue Invoices</p>
                        <p className="text-2xl font-bold">{stats.overdue}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Invoices Table */}
              <Card>
                <CardHeader>
                  <CardTitle>All Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by customer..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Table */}
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedInvoices.map(invoice => (
                          <TableRow key={invoice.id}>
                            <TableCell>{invoice.customer}</TableCell>
                            <TableCell>${invoice.amount}</TableCell>
                            <TableCell>{invoice.status}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button size="icon" variant="outline" onClick={() => router.push(`/admin/invoice/${invoice.id}`)}><Eye className="h-4 w-4" /></Button>
                                <Button size="icon" variant="outline" onClick={() => { setEditInvoice(invoice); setEditOpen(invoice.id); }}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="destructive" onClick={() => {/* TODO: handle delete */}}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {/* Pagination */}
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
                    <span className="self-center">Page {currentPage} of {totalPages}</span>
                    <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {editInvoice && (
        <Dialog open={!!editOpen} onOpenChange={open => { if (!open) setEditOpen(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Invoice</DialogTitle>
            </DialogHeader>
            <InvoiceForm mode="edit" initialData={editInvoice} loading={loading} onSubmit={handleEdit} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 