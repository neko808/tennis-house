"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

const ROWS = [
  ["XS", "81–86", "66–71"],
  ["S", "89–94", "74–79"],
  ["M", "96–102", "81–86"],
  ["L", "104–109", "89–94"],
  ["XL", "112–117", "96–102"],
];

export function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-11 text-small text-ink-muted underline underline-offset-4 hover:text-ink"
      >
        Size guide
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Size guide">
        <p className="mb-4 text-small text-ink-muted">
          Sample size chart for demo purposes — final measurements arrive with the real catalog.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-body">
            <thead>
              <tr className="border-b border-ink text-small uppercase tracking-wide">
                <th scope="col" className="py-2 pr-4">Size</th>
                <th scope="col" className="py-2 pr-4">Chest (cm)</th>
                <th scope="col" className="py-2">Waist (cm)</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([size, chest, waist]) => (
                <tr key={size} className="border-b border-line">
                  <th scope="row" className="py-2 pr-4 font-medium">{size}</th>
                  <td className="price py-2 pr-4">{chest}</td>
                  <td className="price py-2">{waist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
