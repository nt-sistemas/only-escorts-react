import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.js";
import { Input } from "../../components/ui/input.js";
import { Button } from "../../components/ui/button.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table.js";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategoriesData,
  type AdminCategory,
  type NamedEntityPayload,
  updateAdminCategory,
} from "../../services/admin.js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog.js";

export function AdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = async ({ showLoading }: { showLoading: boolean }) => {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const data = await getAdminCategoriesData();
      setCategories(data);
      setNotice(data.length === 0 ? "No categories found in API." : null);
    } catch {
      setNotice("Could not load categories from API.");
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCategories({ showLoading: true });
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return categories;
    }

    return categories.filter((category) =>
      category.name.toLowerCase().includes(query),
    );
  }, [categories, search]);

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  const handleEdit = (category: AdminCategory) => {
    setEditingId(category.id);
    setName(category.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNotice("Category name is required.");
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    const payload: NamedEntityPayload = {
      name: name.trim(),
    };

    try {
      if (editingId) {
        await updateAdminCategory(editingId, payload);
      } else {
        await createAdminCategory(payload);
      }

      await fetchCategories({ showLoading: false });
      resetForm();
    } catch {
      setNotice("Could not save category to API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await deleteAdminCategory(categoryId);
      await fetchCategories({ showLoading: false });
      setNotice(null);
    } catch {
      setNotice("Could not delete category from API.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-white">
          Categories Management
        </h1>
        <p className="text-neutral-400">
          Create and manage categories from endpoint /admin/category
        </p>
        {notice && <p className="mt-2 text-sm text-neutral-500">{notice}</p>}
      </div>

      <Card className="border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-white">
            {editingId ? "Edit Category" : "Create New Category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-3 md:grid-cols-4"
          >
            <Input
              placeholder="Category name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              className="border-neutral-700 bg-neutral-800 text-white md:col-span-3"
            />

            <div className="md:col-span-1 flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
              </Button>
              {editingId && (
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

      <Card className="border-neutral-800 bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-white">Registered Categories</CardTitle>
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            className="mt-3 border-neutral-700 bg-neutral-800 text-white"
          />
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className="mb-3 text-sm text-neutral-500">
              Loading categories from API...
            </p>
          )}

          <div className="overflow-hidden rounded-lg border border-neutral-800">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-700 bg-neutral-800 hover:bg-neutral-800">
                  <TableHead className="text-neutral-300">Name</TableHead>
                  <TableHead className="text-neutral-300">Created At</TableHead>
                  <TableHead className="text-right text-neutral-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((category) => (
                  <TableRow
                    key={category.id}
                    className="border-neutral-800 hover:bg-neutral-800/50"
                  >
                    <TableCell className="font-medium text-white">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-neutral-400">
                      {category.createdAt
                        ? new Date(category.createdAt).toLocaleDateString(
                            "en-GB",
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-neutral-700 text-neutral-200"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteId(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && filtered.length === 0 && (
                  <TableRow className="border-neutral-800">
                    <TableCell className="text-neutral-400" colSpan={3}>
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteId) {
                  void handleDelete(deleteId);
                }
                setDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
