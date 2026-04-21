import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const PREFIXES = ["Mr.", "Mrs.", "Ms."];

const AsianInvoice = () => {
  const [prefix, setPrefix] = useState("Mr.");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [invNo, setInvNo] = useState("436");
  const [items, setItems] = useState([
    { description: "Washing Machine Repair", note: "", amount: "" },
    { description: "Transportation", note: "", amount: "" },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const invoiceRef = useRef(null);

  const addRow = () => setItems([...items, { description: "", note: "", amount: "" }]);
  const removeRow = (idx) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== idx));
  };
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const total = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const handleSubmit = () => setSubmitted(true);
  const handleReset = () => {
    setPrefix("Mr.");
    setToName("");
    setToPhone("");
    setToAddress("");
    setInvoiceDate("");
    setInvNo("436");
    setItems([
      { description: "Washing Machine Repair", note: "", amount: "" },
      { description: "Transportation", note: "", amount: "" },
    ]);
    setSubmitted(false);
  };

  const savePDF = async () => {
    setSaving(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const iw = pw - 16;
      const ih = (canvas.height * iw) / canvas.width;
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        8,
        ih < ph ? (ph - ih) / 2 : 8,
        iw,
        Math.min(ih, ph - 16)
      );
      pdf.save(`Invoice-${invNo}-${toName || "Customer"}.pdf`);
    } catch (e) {
      alert("PDF save failed: " + e.message);
    }
    setSaving(false);
  };

  const saveImage = async () => {
    setSaving(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Invoice-${invNo}-${toName || "Customer"}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Image save failed: " + e.message);
    }
    setSaving(false);
  };

  const displayName = toName ? `${prefix} ${toName}` : prefix;

  const field = {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "8px 12px",
    fontSize: 13,
    outline: "none",
    background: "white",
    color: "#1f2937",
    fontFamily: "'Segoe UI', sans-serif",
  };

  // ── FORM VIEW ──────────────────────────────────────────────────────────
  if (!submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "32px 16px", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>

          {/* Top bar */}
          <div style={{ background: "#1e293b", borderRadius: 16, padding: "20px 28px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2, margin: 0 }}>Invoice Generator</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: "white", margin: "4px 0 0" }}>ASIAN CONS & ENGG PTE LTD</p>
            </div>
            <div style={{ textAlign: "right", fontSize: 11, color: "#94a3b8", lineHeight: 1.8 }}>
              <p style={{ margin: 0 }}>Co. Reg: 202334587K</p>
              <p style={{ margin: 0 }}>Tel: +65 8530 1773</p>
            </div>
          </div>

          {/* Form card */}
          <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

            {/* Invoice badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ background: "#f97316", color: "white", fontWeight: 800, letterSpacing: 2, fontSize: 17, padding: "6px 20px", borderRadius: 12 }}>INVOICE</span>
              <div style={{ fontSize: 13, color: "#374151", textAlign: "right" }}>
                <span style={{ color: "#9ca3af" }}>INV NO: </span>
                <strong>#{invNo}</strong>
              </div>
            </div>

            {/* Customer section */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, borderBottom: "2px solid #e5e7eb", paddingBottom: 8, marginBottom: 16 }}>Customer Information</p>

            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <select value={prefix} onChange={(e) => setPrefix(e.target.value)}
                style={{ ...field, width: 110, fontWeight: 700, cursor: "pointer" }}>
                {PREFIXES.map((p) => <option key={p}>{p}</option>)}
              </select>
              <input type="text" placeholder="Customer Name (optional)" value={toName}
                onChange={(e) => setToName(e.target.value)} style={{ ...field, flex: 1 }} />
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <input type="text" placeholder="Phone (optional)" value={toPhone}
                onChange={(e) => setToPhone(e.target.value)} style={{ ...field, flex: 1 }} />
              <input type="text" placeholder="Address (optional)" value={toAddress}
                onChange={(e) => setToAddress(e.target.value)} style={{ ...field, flex: 1 }} />
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Invoice Date</label>
                <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)}
                  style={{ ...field, width: "100%" }} />
              </div>
              <div style={{ width: 140 }}>
                <label style={{ display: "block", fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>Invoice No.</label>
                <input type="text" value={invNo} onChange={(e) => setInvNo(e.target.value)}
                  style={{ ...field, width: "100%" }} />
              </div>
            </div>

            {/* Items section */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, borderBottom: "2px solid #e5e7eb", paddingBottom: 8, marginBottom: 16 }}>Items & Services</p>

            {items.map((item, i) => (
              <div key={i} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: "#334155", color: "white", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                  <input type="text" placeholder="Description" value={item.description}
                    onChange={(e) => updateItem(i, "description", e.target.value)}
                    style={{ ...field, flex: 1, fontWeight: 600 }} />
                  <input type="number" placeholder="$0.00" value={item.amount}
                    onChange={(e) => updateItem(i, "amount", e.target.value)}
                    style={{ ...field, width: 110, textAlign: "right" }} />
                  {items.length > 1 && (
                    <button onClick={() => removeRow(i)}
                      style={{ width: 28, height: 28, borderRadius: "50%", background: "#fee2e2", color: "#dc2626", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
                  )}
                </div>
                <textarea placeholder={i === 0 ? "Add repair details..." : "Additional notes (optional)..."}
                  value={item.note} onChange={(e) => updateItem(i, "note", e.target.value)}
                  rows={i === 0 ? 2 : 1}
                  style={{ ...field, width: "100%", borderStyle: "dashed", fontSize: 12, color: "#6b7280", resize: "vertical", boxSizing: "border-box" }} />
              </div>
            ))}

            <button onClick={addRow}
              style={{ background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              ＋ Add Item
            </button>

            {/* Total */}
            <div style={{ marginTop: 20, background: "#1e293b", borderRadius: 12, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#cbd5e1", fontWeight: 600, fontSize: 14 }}>Total Amount</span>
              <span style={{ color: "white", fontWeight: 800, fontSize: 24 }}>${total.toFixed(2)}</span>
            </div>

            {/* Generate button */}
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <button onClick={handleSubmit}
                style={{ background: "#f97316", color: "white", border: "none", borderRadius: 12, padding: "13px 44px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                Generate Invoice →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── INVOICE PREVIEW ────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "32px 16px", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <button onClick={handleReset}
            style={{ background: "white", border: "1px solid #d1d5db", color: "#374151", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            ← New Invoice
          </button>
          <button onClick={savePDF} disabled={saving}
            style={{ background: "#1e293b", color: "white", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving..." : "⬇ Save as PDF"}
          </button>
          <button onClick={saveImage} disabled={saving}
            style={{ background: "#4b5563", color: "white", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving..." : "🖼 Save as Image"}
          </button>
        </div>

        {/* ── Printable Invoice (সব inline style) ── */}
        <div ref={invoiceRef} style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid #e5e7eb", fontFamily: "'Segoe UI', sans-serif" }}>

          {/* Header */}
          <div style={{ background: "white", padding: "28px 32px", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 2, margin: "0 0 4px" }}>Issued by</p>
                <p style={{ fontSize: 17, fontWeight: 800, color: "#1e293b", margin: 0 }}>ASIAN CONS & ENGG PTE LTD</p>
                <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.9, marginTop: 6, margin: "6px 0 0" }}>
                  Co. Reg. No: 202334587K<br />
                  7030 Ang Mo Kio Ave 5, #01-53, Singapore 569880<br />
                  Tel: +65 8530 1773 | washingsolutionsg@gmail.com
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 30, fontWeight: 900, color: "#d1d5db", letterSpacing: 4, margin: 0 }}>INVOICE</p>
                <span style={{ background: "#f97316", color: "white", fontWeight: 700, fontSize: 13, padding: "3px 14px", borderRadius: 8, display: "inline-block", marginTop: 6 }}>
                  #{invNo}
                </span>
                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{invoiceDate || "—"}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "14px 32px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 2, margin: "0 0 4px" }}>Bill To</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: 0 }}>{displayName}</p>
            {toPhone && <p style={{ fontSize: 13, color: "#6b7280", margin: "3px 0 0" }}>{toPhone}</p>}
            {toAddress && <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 0" }}>{toAddress}</p>}
          </div>

          {/* Table */}
          <div style={{ padding: "24px 32px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#1e293b" }}>
                  <th style={{ textAlign: "left", color: "#e2e8f0", fontSize: 11, fontWeight: 700, padding: "10px 14px", width: 36 }}>S/N</th>
                  <th style={{ textAlign: "left", color: "#e2e8f0", fontSize: 11, fontWeight: 700, padding: "10px 14px" }}>DESCRIPTION</th>
                  <th style={{ textAlign: "right", color: "#e2e8f0", fontSize: 11, fontWeight: 700, padding: "10px 14px", width: 130 }}>AMOUNT ($)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: i % 2 === 0 ? "white" : "#f9fafb" }}>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "#1f2937" }}>
                      <p style={{ fontWeight: 600, margin: 0 }}>{item.description}</p>
                      {item.note && <p style={{ fontSize: 11, color: "#9ca3af", margin: "3px 0 0", fontStyle: "italic" }}>{item.note}</p>}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13, textAlign: "right", fontWeight: 600, color: "#1f2937" }}>
                      {item.amount ? `$${parseFloat(item.amount).toFixed(2)}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total box */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <div style={{ background: "#1e293b", color: "white", borderRadius: 12, padding: "16px 24px", minWidth: 220, textAlign: "right" }}>
                <p style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>Total Amount</p>
                <p style={{ fontSize: 28, fontWeight: 800, margin: "6px 0 0" }}>${total.toFixed(2)}</p>
              </div>
            </div>

            {/* PayNow */}
            <div style={{ marginTop: 20, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "10px 16px", display: "inline-block" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#92400e" }}>PAYNOW: </span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>83714275K</span>
            </div>

            {/* Signature row */}
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <p style={{ fontSize: 13, color: "#9ca3af", fontStyle: "italic", margin: 0 }}>Thank you for your business!</p>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1f2937", margin: "0 0 8px" }}>For ASIAN CONS & ENGG PTE LTD</p>
                <svg width="130" height="46" viewBox="0 0 130 46" fill="none" style={{ display: "block", marginLeft: "auto", marginBottom: 4 }}>
                  <path d="M6 36 C14 14, 26 8, 34 20 C39 28, 37 36, 44 26 C52 14, 56 6, 64 20 C70 30, 67 38, 75 26 C82 14, 87 6, 96 18 C102 28, 100 38, 108 28 C114 20, 118 14, 124 18"
                    stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M18 42 C40 39, 65 40, 90 39 C104 38, 116 39, 126 37"
                    stroke="#1e293b" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.4" />
                </svg>
                <div style={{ borderTop: "2px solid #1e293b", paddingTop: 6, fontSize: 11, color: "#9ca3af" }}>Authorized Signatory</div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #f3f4f6", textAlign: "center", fontSize: 11, color: "#9ca3af", fontStyle: "italic" }}>
              Thank you for your business! · Asian Cons & Engg Pte Ltd · Washingsolutionsg.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsianInvoice;