import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  optionKey = "value",
  optionLabel = "label",
  error,
  required,
  disabled,
  className,
}) => {
  // ✅ ALWAYS controlled
  const stringValue =
    value !== null && value !== undefined ? String(value) : "";

  return (
    <div className="space-y-1">
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <Select
        value={stringValue}
        onValueChange={onChange} // always string
        disabled={disabled}
      >
        <SelectTrigger
          className={`${className ?? ""} ${
            disabled ? "bg-muted cursor-not-allowed" : ""
          }`}
        >
          <SelectValue placeholder={`Select ${label ?? "Value"}`} />
        </SelectTrigger>

        <SelectContent>
          {options.map((o) => (
            <SelectItem key={String(o[optionKey])} value={String(o[optionKey])}>
              {o[optionLabel]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SelectField;
