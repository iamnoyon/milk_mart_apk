export const AREA_OPTIONS: { label: string; value: string }[] = [
  { label: "Mirpur DOSH", value: "mirpurdosh" },
  { label: "Dhanmondi", value: "dhanmondi" },
  { label: "Uttara", value: "uttara" },
  { label: "Mohammadpur", value: "mohammadpur" },
  { label: "Gulshan", value: "gulshan" },
];

export const resolveAreaLabel = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const match = AREA_OPTIONS.find(
    (opt) =>
      opt.value.toLowerCase() === String(value).trim().toLowerCase() ||
      opt.label.toLowerCase() === String(value).trim().toLowerCase()
  );
  return match?.label ?? String(value);
};
