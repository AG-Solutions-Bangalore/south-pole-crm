import ApiErrorPage from "@/components/api-error/api-error";
import {
  ItemCreate,
  ItemEdit,
} from "@/components/buttoncontrol/button-component";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ITEMS_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const INITIAL_STATE = {
  item_hsn_code: "",
  item_brand_name: "",
  item_generic_name: "",
  item_company_name: "",
  item_gst: "",
  item_status: "Active",
};

const ItemForm = React.memo(function ItemForm({ editId, onSuccess }) {
  const isEdit = Boolean(editId);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const { trigger: fetchItem, loading: loadingData, error } = useApiMutation();
  const { trigger, loading } = useApiMutation();

  const fetchItemData = async () => {
    try {
      const res = await fetchItem({
        url: ITEMS_API.getById(editId),
      });

      setFormData({
        item_hsn_code: res?.data?.item_hsn_code || "",
        item_brand_name: res?.data?.item_brand_name || "",
        item_generic_name: res?.data?.item_generic_name || "",
        item_company_name: res?.data?.item_company_name || "",
        item_gst: res?.data?.item_gst || "",
        item_status: res?.data?.item_status || "Active",
      });
    } catch (err) {
      toast.error(err.message || "Failed to load item");
    }
  };

  useEffect(() => {
    if (open && isEdit) fetchItemData();
  }, [open, isEdit, editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    if (value === "") {
      setFormData({ ...formData, [name]: "" });
      return;
    }

    if (/^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async () => {
    if (
      !formData.item_hsn_code ||
      !formData.item_brand_name ||
      !formData.item_generic_name ||
      !formData.item_company_name ||
      !formData.item_gst
    ) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      const res = await trigger({
        url: isEdit ? ITEMS_API.updateById(editId) : ITEMS_API.create,
        method: isEdit ? "PUT" : "POST",
        data: formData,
      });

      toast.success(
        res.message ??
          (isEdit
            ? res.message || "Item updated successfully"
            : res.message || "Item created successfully")
      );

      setOpen(false);
      setFormData(INITIAL_STATE);
      onSuccess?.();
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  if (error) return <ApiErrorPage onRetry={fetchItemData} />;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {loadingData && <LoadingBar />}

      <DialogTrigger asChild>
        {isEdit ? (
          <ItemEdit onClick={() => setOpen(true)} />
        ) : (
          <ItemCreate onClick={() => setOpen(true)} />
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Item" : "Create Item"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div>
            <Label>HSN Code *</Label>
            <Input
              name="item_hsn_code"
              value={formData.item_hsn_code}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Brand Name *</Label>
            <Input
              name="item_brand_name"
              value={formData.item_brand_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Generic Name *</Label>
            <Input
              name="item_generic_name"
              value={formData.item_generic_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Company Name *</Label>
            <Input
              name="item_company_name"
              value={formData.item_company_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>GST % *</Label>
            <Input
              name="item_gst"
              value={formData.item_gst}
              onChange={handleNumberChange}
            />
          </div>

          {isEdit && (
            <div>
              <Label>Status</Label>
              <Select
                value={formData.item_status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, item_status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="Inactive">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              "Update Item"
            ) : (
              "Create Item"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default ItemForm;
