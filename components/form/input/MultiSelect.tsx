import React, { useEffect, useRef, useState } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: SelectOption[];
  value?: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select options",
  disabled = false,
  error = false,
  hint,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setSearch("");
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  // Handle outside clicks
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync scroll with keyboard highlight
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedElement = listRef.current.children[
        highlighted
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlighted, isOpen]);

  const toggle = (val: string) => {
    const newValue = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((i) => (i < filteredOptions.length - 1 ? i + 1 : i));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((i) => (i > 0 ? i - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        const option = filteredOptions[highlighted];
        if (option) {
          toggle(option.value);
        }
        break;
      case "Escape":
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={ref} className="relative w-full" onKeyDown={handleKeyDown}>
      {/* Multi-Select Trigger Container */}
      <div
        onClick={() => !disabled && setIsOpen((p) => !p)}
        className={`min-h-11 w-full rounded-lg border px-3 py-2 flex items-start justify-between gap-2 cursor-pointer transition-all
          ${disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : "bg-white"}
          ${
            error
              ? "border-red-500"
              : isOpen
              ? "ring-2 ring-blue-500/20 border-blue-500"
              : "border-gray-300"
          }
          dark:border-gray-700 dark:bg-gray-900`}
      >
        {/* Left Side: Tags and Placeholder */}
        <div className="flex flex-wrap gap-2 flex-1">
          {value.length === 0 && (
            <span className="text-gray-400 text-sm py-1">{placeholder}</span>
          )}

          {value.map((val) => {
            const opt = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {opt?.label}
                <button
                  type="button"
                  className="hover:text-blue-900 dark:hover:text-blue-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(val);
                  }}
                >
                  ✕
                </button>
              </span>
            );
          })}
        </div>

        {/* Right Side: Arrow Icon */}
        <div className="flex items-center h-7">
          {" "}
          {/* h-7 aligns it with the first row of tags */}
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path d="M5 7l5 5 5-5" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
          <input
            ref={searchInputRef}
            className="w-full border-b border-gray-100 px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setHighlighted(0);
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <div ref={listRef} className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, i) => {
                const isSelected = value.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => toggle(opt.value)}
                    onMouseEnter={() => setHighlighted(i)}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm transition-colors
                    ${
                      highlighted === i
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <svg
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-sm text-gray-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error ? "text-red-500" : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default MultiSelect;
