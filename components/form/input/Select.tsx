import React, { useEffect, useRef, useState } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  hint?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value = "",
  placeholder = "Select option",
  onChange,
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

  const selectedOption = options.find((o) => o.value === value);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
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

  // Reset highlight index when search results change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearch(v);
    setHighlighted(0);
  };

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

  // Keyboard navigation logic
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
          onChange(option.value);
          setIsOpen(false);
        }
        break;
      case "Escape":
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  // Scroll highlighted item into view
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

  return (
    <div ref={ref} className="relative w-full" onKeyDown={handleKeyDown}>
      {/* Select Trigger */}
      <div
        onClick={() => !disabled && setIsOpen((p) => !p)}
        className={`h-11 w-full rounded-lg border px-4 py-2.5 text-sm flex items-center justify-between transition-all
        ${error ? "border-red-500" : "border-gray-300"}
        ${
          disabled
            ? "opacity-60 cursor-not-allowed bg-gray-50"
            : "cursor-pointer bg-white"
        }
        dark:border-gray-700 dark:bg-gray-900`}
      >
        <span
          className={
            selectedOption
              ? "text-gray-800 dark:text-white/90"
              : "text-gray-400"
          }
        >
          {selectedOption?.label || placeholder}
        </span>

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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
          <input
            ref={searchInputRef}
            className="w-full border-b border-gray-100 px-3 py-2 text-sm outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
            // Stop propagation to prevent trigger from toggling
            onClick={(e) => e.stopPropagation()}
          />

          <div
            ref={listRef}
            className="max-h-60 overflow-y-auto custom-scrollbar"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, i) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`cursor-pointer px-3 py-2 text-sm transition-colors
                  ${
                    highlighted === i
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {opt.label}
                </div>
              ))
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

export default Select;
