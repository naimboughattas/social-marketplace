export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}