import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Input({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  leftIcon,
  required = false,
  disabled = false,
  className = '',
  autoComplete,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name || Math.random().toString(36).substring(2, 7);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-slate-300 tracking-wide"
        >
          {label} {required && <span className="text-emerald-400">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full rounded-lg bg-dark-900 border text-slate-100 placeholder-slate-500 text-sm py-2.5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-dark-950 disabled:bg-dark-950 disabled:text-slate-600 ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${isPassword ? 'pr-10' : 'pr-3.5'} ${
            error
              ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30'
              : 'border-slate-700/80 hover:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500/30'
          } ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error ? (
        <div id={`${inputId}-error`} className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-xs text-slate-400 mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
