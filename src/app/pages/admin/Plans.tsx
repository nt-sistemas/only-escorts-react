import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  createAdminPlan,
  deleteAdminPlan,
  getAdminPlansData,
  type AdminPlan,
  type PlanPayload,
  updateAdminPlan,
} from "../../services/admin.js";

type PlanFormData = {
  name: string;
  description: string;
  price: string;
  freeTrialDays: string;
};

const DEFAULT_FORM: PlanFormData = {
  name: "",
  description: "",
  price: "",
  freeTrialDays: "0",
};

function parsePriceToNumber(value: string): number {
  const normalized = value
    .replace("€", "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  return Number(normalized) || 0;
}

export function AdminPlans() {
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [form, setForm] = useState<PlanFormData>(DEFAULT_FORM);

  const fetchPlans = async ({ showLoading }: { showLoading: boolean }) => {
    if (showLoading) {
      setIsLoadingPlans(true);
    }

    try {
      const data = await getAdminPlansData();
      setPlans(data);
      setNotice(data.length === 0 ? "No plans found in API." : null);
    } catch {
      setNotice("Could not load plans from API.");
    } finally {
      if (showLoading) {
        setIsLoadingPlans(false);
      }
    }
  };

  useEffect(() => {
    fetchPlans({ showLoading: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPlans = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return plans;
    }

    return plans.filter(
      (plan) =>
        plan.name.toLowerCase().includes(query) ||
        (plan.description || "").toLowerCase().includes(query),
    );
  }, [plans, search]);

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingPlanId(null);
  };

  const handleEdit = (plan: AdminPlan) => {
    setEditingPlanId(plan.id);
    setForm({
      name: plan.name,
      description: plan.description || "",
      price: String(plan.price),
      freeTrialDays: String(plan.freeTrialDays),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setNotice("Plan name is required.");
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    const payload: PlanPayload = {
      name: form.name.trim(),
      ...(form.description.trim() ? { description: form.description.trim() } : {}),
      price: parsePriceToNumber(form.price),
      freeTrialDays: Number(form.freeTrialDays) || 0,
    };

    try {
      if (editingPlanId) {
        await updateAdminPlan(editingPlanId, payload);
      } else {
        await createAdminPlan(payload);
      }

      await fetchPlans({ showLoading: false });
      resetForm();
      setNotice(null);
    } catch {
      setNotice("Could not save plan to API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (planId: string) => {
    try {
      await deleteAdminPlan(planId);
      await fetchPlans({ showLoading: false });
      setNotice(null);
    } catch {
      setNotice("Could not delete plan from API.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Plans Management</h1>
        <p className="text-neutral-400">Create and manage plans from endpoint /admin/plan</p>
        {notice && <p className="mt-2 text-sm text-neutral-500">{notice}</p>}
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">
            {editingPlanId ? "Edit Plan" : "Create New Plan"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input
              placeholder="Plan name"
              value={form.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="md:col-span-1 bg-neutral-800 border-neutral-700 text-white"
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="md:col-span-4 bg-neutral-800 border-neutral-700 text-white"
            />
            <Input
              placeholder="Price (e.g. 149,00)"
              value={form.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, price: e.target.value }))
              }
              className="md:col-span-1 bg-neutral-800 border-neutral-700 text-white"
            />

            <Input
              type="number"
              min={0}
              placeholder="Free trial days"
              value={form.freeTrialDays}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((prev) => ({ ...prev, freeTrialDays: e.target.value }))
              }
              className="md:col-span-1 bg-neutral-800 border-neutral-700 text-white"
            />

            <div className="md:col-span-5 flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="w-full bg-pink-500 hover:bg-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : editingPlanId ? "Update Plan" : "Create Plan"}
              </Button>
              {editingPlanId && (
                <Button type="button" variant="outline" className="border-neutral-700 text-white" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Registered Plans</CardTitle>
          <Input
            placeholder="Search plans..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="mt-3 bg-neutral-800 border-neutral-700 text-white"
          />
        </CardHeader>
        <CardContent>
          {isLoadingPlans && (
            <p className="text-sm text-neutral-500 mb-3">Loading plans from API...</p>
          )}
          <div className="rounded-lg border border-neutral-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-800 border-neutral-700 hover:bg-neutral-800">
                  <TableHead className="text-neutral-300">Name</TableHead>
                  <TableHead className="text-neutral-300">Description</TableHead>
                  <TableHead className="text-neutral-300">Price</TableHead>
                  <TableHead className="text-neutral-300">Free Trial</TableHead>
                  <TableHead className="text-neutral-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id} className="border-neutral-800 hover:bg-neutral-800/50">
                    <TableCell className="text-white font-medium">{plan.name}</TableCell>
                    <TableCell className="text-neutral-300">{plan.description || "-"}</TableCell>
                    <TableCell className="text-pink-500 font-semibold tracking-tight">
                      € {new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(plan.price)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {plan.freeTrialDays} days
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button size="sm" variant="outline" className="border-neutral-700 text-neutral-200" onClick={() => handleEdit(plan)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(plan.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoadingPlans && filteredPlans.length === 0 && (
                  <TableRow className="border-neutral-800">
                    <TableCell className="text-neutral-400" colSpan={5}>
                      No plans found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
