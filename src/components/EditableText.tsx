import React, { useEffect, useRef, useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onChange: (nextValue: string) => void;
  isEditMode: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  multiline?: boolean;
  className?: string;
  inputClassName?: string;
  label?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  isEditMode,
  as: Tag = 'span',
  multiline = false,
  className = '',
  inputClassName = '',
  label,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (!isEditMode && editing) {
      setEditing(false);
      setDraft(value);
    }
  }, [isEditMode, editing, value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed.length > 0) {
      onChange(draft);
    } else {
      setDraft(value);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (!isEditMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (editing) {
    return (
      <span
        className="inline-flex flex-col gap-2 w-full max-w-full align-top my-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        {label && (
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Editant: {label}
          </span>
        )}
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') handleCancel();
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave();
            }}
            rows={Math.min(6, Math.max(3, Math.ceil(draft.length / 65)))}
            className={`w-full rounded-lg border border-amber-500 bg-white px-3 py-2 text-sm text-[#111418] shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${inputClassName}`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') handleCancel();
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
              }
            }}
            className={`w-full rounded-lg border border-amber-500 bg-white px-3 py-1.5 text-sm text-[#111418] shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${inputClassName}`}
          />
        )}
        <span className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1 rounded-md bg-[#111418] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#272D35] transition-colors cursor-pointer whitespace-nowrap"
          >
            <Check className="w-3.5 h-3.5" />
            Aplicar
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer whitespace-nowrap"
          >
            <X className="w-3.5 h-3.5" />
            Cancel·lar
          </button>
        </span>
      </span>
    );
  }

  return (
    <Tag
      role="button"
      tabIndex={0}
      title={label ? `Clica per editar: ${label}` : 'Clica per editar aquest text'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setEditing(true);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setEditing(true);
        }
      }}
      className={`${className} group/edit relative cursor-text rounded-sm outline-dashed outline-1 outline-amber-500/60 hover:outline-amber-500 hover:bg-amber-400/10 transition-colors`}
    >
      {value}
      <span
        aria-hidden="true"
        className="ml-1.5 inline-flex items-center justify-center rounded bg-amber-500 p-0.5 text-white opacity-75 group-hover/edit:opacity-100 align-middle"
      >
        <Pencil className="w-2.5 h-2.5" />
      </span>
    </Tag>
  );
};
