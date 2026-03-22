interface FormInputProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  unit: string;
  hint?: string;
}

const FormInput = ({ label, required, value, onChange, placeholder, unit, hint }: FormInputProps) => {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1 text-[13px] font-semibold text-muted-foreground mb-2">
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3.5 pr-14 border-[1.5px] border-border rounded-xl bg-card text-base font-semibold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground placeholder:font-normal placeholder:text-sm"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
          {unit}
        </span>
      </div>
      {hint && <p className="text-[11px] text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  );
};

export default FormInput;
