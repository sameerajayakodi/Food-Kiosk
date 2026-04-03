import { Coins, Edit3, Plus, Save, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "../../store/useStore";
import type { Employee } from "../../types";
import { formatCurrency } from "../../utils/helpers";

interface EmployeeForm {
  name: string;
  email: string;
  phone: string;

  creditLimit: string;
  joinDate: string;
  active: boolean;
}

const emptyForm: EmployeeForm = {
  name: "",
  email: "",
  phone: "",

  creditLimit: "",
  joinDate: new Date().toISOString().split("T")[0],
  active: true,
};

export default function AdminEmployees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, topUpEmployeeBalance } = useStore();

  const [searchQuery, setSearchQuery] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EmployeeForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [topUpId, setTopUpId] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState("");



  const filteredEmployees = employees.filter((e) => {
    if (
      searchQuery &&
      !e.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !e.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleOpenEdit = (employee: Employee) => {
    setForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
     
      creditLimit: employee.creditLimit.toString(),
      joinDate: employee.joinDate,
      active: employee.active,
    });
    setEditingId(employee.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const creditLimit = parseFloat(form.creditLimit);
    if (isNaN(creditLimit) || creditLimit < 0) return;
    if (!form.name.trim() || !form.email.trim()) return;

    const employeeData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    
      creditLimit,
      currentBalance: 0,
      joinDate: form.joinDate,
      active: form.active,
    };

    if (editingId) {
      updateEmployee(editingId, employeeData);
    } else {
      addEmployee(employeeData);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    deleteEmployee(id);
    setDeleteConfirm(null);
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpId) return;
    const amount = parseInt(topUpAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      topUpEmployeeBalance(topUpId, amount);
    }
    setTopUpId(null);
    setTopUpAmount("");
  };

  const getTotalPayroll = () => {
    return filteredEmployees.reduce((sum, e) => sum + e.creditLimit, 0);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Employee Management
          </h1>
          <p className="text-slate-600 mt-1">
            {filteredEmployees.length} employees shown
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Employees" value={employees.length.toString()} />
        <StatCard
          label="Active Staff"
          value={employees.filter((e) => e.active).length.toString()}
        />
        <StatCard
          label="Total Credit Limits"
          value={formatCurrency(
            employees.reduce((sum, e) => sum + e.creditLimit, 0),
          )}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Employee
              </th>

              {/* <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Contact
              </th> */}
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Credit Limit
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Balance
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Status
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredEmployees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {employee.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Joined {new Date(employee.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </td>

                {/* <td className="px-6 py-4">
                  <div className="text-sm text-slate-900 font-medium">
                    {employee.phone}
                  </div>
                  <div className="text-sm text-slate-500">{employee.email}</div>
                </td> */}
                <td className="px-6 py-4 font-semibold text-slate-900">
                  {formatCurrency(employee.creditLimit)}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full  font-bold text-sm">
                     <Coins className="w-3.5 h-3.5" />
                     {formatCurrency(employee.currentBalance || 0)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      updateEmployee(employee.id, { active: !employee.active })
                    }
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      employee.active
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {employee.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setTopUpId(employee.id)}
                      title="Top up balance"
                      className="p-2 hover:bg-amber-100 text-amber-600 rounded-lg transition-colors"
                    >
                      <Coins className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(employee)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {deleteConfirm === employee.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(employee.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-sm font-medium">No employees found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Employee" : "Add New Employee"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. John Smith"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="555-0123"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Credit Limit */}
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-1.5">
                  Credit Limit (LKR) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="100"
                  value={form.creditLimit}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, creditLimit: e.target.value }))
                  }
                  placeholder="0"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Join Date */}
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-1.5">
                  Join Date
                </label>
                <input
                  type="date"
                  value={form.joinDate}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, joinDate: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Active Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, active: e.target.checked }))
                  }
                  className="w-4 h-4 rounded accent-emerald-600"
                />
                <span className="text-sm font-medium text-slate-700">
                  Active
                </span>
              </label>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? "Update" : "Add"} Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {topUpId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                   <Coins className="w-5 h-5 text-amber-500" />
                   Add Balance
                </h2>
                <button onClick={() => setTopUpId(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                   <X className="w-5 h-5 text-slate-500" />
                </button>
             </div>
             <form onSubmit={handleTopUpSubmit}>
                <div className="mb-6">
                   <label className="text-sm font-semibold text-slate-900 block mb-2">Balance Amount</label>
                   <input
                     type="number"
                     min="1"
                     required
                     value={topUpAmount}
                     onChange={(e) => setTopUpAmount(e.target.value)}
                     placeholder="e.g. 500"
                     className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                   />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors"
                >
                  Top Up Account
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-slate-600 mb-2">{label}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
