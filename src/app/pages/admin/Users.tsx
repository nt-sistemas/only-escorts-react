import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "../../components/ui/input.js";
import { Button } from "../../components/ui/button.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.js";
import { Badge } from "../../components/ui/badge.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.js";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminPlansData,
  getAdminUsersData,
  type AdminPlan,
  type AdminUser,
  type UserPayload,
  updateAdminUser,
} from "../../services/admin.js";

type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  planId: string;
};

const DEFAULT_FORM: UserFormData = {
  name: "",
  email: "",
  password: "",
  role: "USER",
  status: "PROCESSING",
  planId: "",
};

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [usersNotice, setUsersNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormData>(DEFAULT_FORM);

  const fetchUsers = async ({ showLoading }: { showLoading: boolean }) => {
    if (showLoading) {
      setIsLoadingUsers(true);
    }

    try {
      const apiUsers = await getAdminUsersData();
      setUsers(apiUsers);
      setUsersNotice(apiUsers.length === 0 ? "No users found in API." : null);
    } catch {
      setUsersNotice("Could not load users from API.");
    } finally {
      if (showLoading) {
        setIsLoadingUsers(false);
      }
    }
  };

  const fetchPlans = async () => {
    try {
      const apiPlans = await getAdminPlansData();
      setPlans(apiPlans);
    } catch {
      setPlans([]);
    }
  };

  useEffect(() => {
    fetchUsers({ showLoading: true });
    fetchPlans();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingUserId(null);
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUserId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
      planId: user.planId || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email.trim()) {
      setUsersNotice("Email is required.");
      return;
    }

    if (!editingUserId && !form.password.trim()) {
      setUsersNotice("Password is required to create a user.");
      return;
    }

    setIsSubmitting(true);
    setUsersNotice(null);

    const payload: UserPayload = {
      email: form.email.trim(),
      ...(form.password.trim() ? { password: form.password.trim() } : {}),
      ...(form.name.trim() ? { name: form.name.trim() } : {}),
      role: form.role,
      status: form.status,
      ...(form.planId.trim() ? { planId: form.planId.trim() } : {}),
    };

    try {
      if (editingUserId) {
        await updateAdminUser(editingUserId, payload);
      } else {
        await createAdminUser(payload);
      }

      await fetchUsers({ showLoading: false });
      resetForm();
      setUsersNotice(null);
    } catch {
      setUsersNotice("Could not save user to API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteAdminUser(userId);
      await fetchUsers({ showLoading: false });
      setUsersNotice(null);
    } catch {
      setUsersNotice("Could not delete user from API.");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: "bg-green-500/10 text-green-500 border-green-500/20",
      PROCESSING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      INACTIVE: "bg-red-500/10 text-red-500 border-red-500/20",
      CANCELED: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
      PAST_DUE: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      UNPAID: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    return (
      <Badge
        variant="outline"
        className={
          variants[status as keyof typeof variants] ||
          "border-neutral-700 text-neutral-300"
        }
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-neutral-400">
          Create and manage users from endpoint /admin/user
        </p>
        {usersNotice && (
          <p className="mt-2 text-sm text-neutral-500">{usersNotice}</p>
        )}
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">
            {editingUserId ? "Edit User" : "Create New User"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-6 gap-3"
          >
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="md:col-span-2 bg-neutral-800 border-neutral-700 text-white"
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="md:col-span-2 bg-neutral-800 border-neutral-700 text-white"
            />
            <Input
              placeholder={
                editingUserId ? "New password (optional)" : "Password"
              }
              type="password"
              value={form.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className="md:col-span-2 bg-neutral-800 border-neutral-700 text-white"
            />

            <Select
              value={form.role}
              onValueChange={(value: string) =>
                setForm((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger className="md:col-span-2 bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={form.status}
              onValueChange={(value: string) =>
                setForm((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="md:col-span-2 bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                <SelectItem value="CANCELED">CANCELED</SelectItem>
                <SelectItem value="PAST_DUE">PAST_DUE</SelectItem>
                <SelectItem value="UNPAID">UNPAID</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={form.planId || "none"}
              onValueChange={(value: string) =>
                setForm((prev) => ({
                  ...prev,
                  planId: value === "none" ? "" : value,
                }))
              }
            >
              <SelectTrigger className="md:col-span-2 bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Plan (optional)" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="none">No plan</SelectItem>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
                {form.planId &&
                  !plans.some((plan) => plan.id === form.planId) && (
                    <SelectItem value={form.planId}>
                      Current ({form.planId})
                    </SelectItem>
                  )}
              </SelectContent>
            </Select>

            <div className="md:col-span-6 flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isSubmitting
                  ? "Saving..."
                  : editingUserId
                    ? "Update User"
                    : "Create User"}
              </Button>
              {editingUserId && (
                <Button
                  type="button"
                  variant="outline"
                  className="border-neutral-700 text-white"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-40 bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="USER">USER</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-neutral-800 border-neutral-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                <SelectItem value="CANCELED">CANCELED</SelectItem>
                <SelectItem value="PAST_DUE">PAST_DUE</SelectItem>
                <SelectItem value="UNPAID">UNPAID</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingUsers && (
            <p className="text-sm text-neutral-500 mb-3">
              Loading users from API...
            </p>
          )}

          <div className="rounded-lg border border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-800 border-neutral-700 hover:bg-neutral-800">
                  <TableHead className="text-neutral-300">Name</TableHead>
                  <TableHead className="text-neutral-300">Email</TableHead>
                  <TableHead className="text-neutral-300">Role</TableHead>
                  <TableHead className="text-neutral-300">Status</TableHead>
                  <TableHead className="text-neutral-300">Plan ID</TableHead>
                  <TableHead className="text-neutral-300">Created</TableHead>
                  <TableHead className="text-neutral-300 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-neutral-800 hover:bg-neutral-800/50"
                  >
                    <TableCell className="font-medium text-white">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-neutral-400">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-neutral-700 text-neutral-300"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-neutral-400">
                      {user.planId || "-"}
                    </TableCell>
                    <TableCell className="text-neutral-400">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-GB")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-neutral-700 text-neutral-200"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {!isLoadingUsers && filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-neutral-400">
                No users found with the selected filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
