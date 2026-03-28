import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const PREFIXES = ["Mr.", "Mrs.", "Ms.", "Dr.", "Engr."];

const AsianColor = () => {
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
    setPrefix("Mr."); setToName(""); setToPhone(""); setToAddress("");
    setInvoiceDate(""); setInvNo("436");
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
        scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#ffffff",
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const iw = pw - 16;
      const ih = (canvas.height * iw) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 8, ih < ph ? (ph - ih) / 2 : 8, iw, Math.min(ih, ph - 16));
      pdf.save(`Invoice-${invNo}-${toName || "Customer"}.pdf`);
    } catch (e) { alert("PDF save failed. Try again."); }
    setSaving(false);
  };

  const saveImage = async () => {
    setSaving(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Invoice-${invNo}-${toName || "Customer"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) { alert("Image save failed. Try again."); }
    setSaving(false);
  };

  const displayName = toName ? `${prefix} ${toName}` : prefix;

  // Neutral palette
  const headerBg = "#ffffff";       // dark slate header
  const accentColor = "#ea580c";    // orange accent (kept for brand)
  const borderColor = "#d1d5db";
  const lightBg = "#f9fafb";
  const mutedText = "#6b7280";
  const darkText = "#111827";
  const sectionLabel = "#374151";

  if (!submitted) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px", fontFamily: "'Segoe UI', sans-serif", background: "#f3f4f6", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ background: headerBg, borderRadius: 14, padding: "22px 28px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#ffffff" }}>ASIAN CONS & ENGG PTE LTD</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>Invoice Generator</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: "#9ca3af", lineHeight: 1.7 }}>
            <div>Co. Reg: 202334587K</div>
            <div>Tel: +65 8530 1773</div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 14, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1px solid ${borderColor}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ background: accentColor, color: "white", borderRadius: 10, padding: "6px 20px", fontWeight: 800, fontSize: 20, letterSpacing: 2 }}>INVOICE</div>
            <div style={{ textAlign: "right", fontSize: 13, color: darkText }}>
              <div><span style={{ color: mutedText }}>INV NO: </span><strong>#{invNo}</strong></div>
            </div>
          </div>

          {/* Section Label */}
          <div style={{ fontSize: 12, fontWeight: 700, color: sectionLabel, textTransform: "uppercase", letterSpacing: 1, borderBottom: `2px solid ${borderColor}`, paddingBottom: 6, marginBottom: 14 }}>Customer Information</div>

          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <select value={prefix} onChange={(e) => setPrefix(e.target.value)}
              style={{ width: 105, border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "8px 10px", fontSize: 14, background: lightBg, color: darkText, fontWeight: 700, cursor: "pointer" }}>
              {PREFIXES.map((p) => <option key={p}>{p}</option>)}
            </select>
            <input type="text" placeholder="Customer Name (optional)" value={toName}
              onChange={(e) => setToName(e.target.value)}
              style={{ flex: 1, border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", color: darkText }} />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <input type="text" placeholder="Phone (optional)" value={toPhone}
              onChange={(e) => setToPhone(e.target.value)}
              style={{ flex: 1, border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", color: darkText }} />
            <input type="text" placeholder="Address (optional)" value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              style={{ flex: 1, border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", color: darkText }} />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: mutedText, marginBottom: 4, display: "block" }}>Invoice Date</label>
              <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)}
                style={{ width: "100%", border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", color: darkText }} />
            </div>
            <div style={{ width: 140 }}>
              <label style={{ fontSize: 12, color: mutedText, marginBottom: 4, display: "block" }}>Invoice No.</label>
              <input type="text" value={invNo} onChange={(e) => setInvNo(e.target.value)}
                style={{ width: "100%", border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", color: darkText }} />
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: sectionLabel, textTransform: "uppercase", letterSpacing: 1, borderBottom: `2px solid ${borderColor}`, paddingBottom: 6, marginBottom: 14 }}>Items & Services</div>

          {items.map((item, i) => (
            <div key={i} style={{ background: lightBg, border: `1.5px solid ${borderColor}`, borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: headerBg, color: "white", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                <input type="text" placeholder="Description" value={item.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                  style={{ flex: 1, border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "7px 10px", fontSize: 14, fontWeight: 600, background: "white", outline: "none", color: darkText }} />
                <input type="number" placeholder="$0.00" value={item.amount}
                  onChange={(e) => updateItem(i, "amount", e.target.value)}
                  style={{ width: 110, border: `1.5px solid ${borderColor}`, borderRadius: 8, padding: "7px 10px", fontSize: 14, textAlign: "right", background: "white", outline: "none", color: darkText }} />
                {items.length > 1 && (
                  <button onClick={() => removeRow(i)} style={{ width: 28, height: 28, borderRadius: "50%", background: "#fee2e2", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
                )}
              </div>
              <textarea placeholder={i === 0 ? "Add repair details..." : "Additional notes (optional)..."} value={item.note}
                onChange={(e) => updateItem(i, "note", e.target.value)} rows={i === 0 ? 2 : 1}
                style={{ width: "100%", border: `1.5px dashed ${borderColor}`, borderRadius: 8, padding: "8px 10px", fontSize: 13, color: mutedText, background: "white", resize: "vertical", outline: "none", fontFamily: "inherit" }} />
            </div>
          ))}

          <button onClick={addRow} style={{ background: "#f3f4f6", color: darkText, border: `1.5px solid ${borderColor}`, borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>＋ Add Item</button>

          <div style={{ marginTop: 20, background: headerBg, borderRadius: 12, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#e5e7eb" }}>Total Amount</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#ffffff" }}>${total.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button onClick={handleSubmit} style={{ background: headerBg, color: "white", border: "none", borderRadius: 12, padding: "13px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Generate Invoice →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px", fontFamily: "'Segoe UI', sans-serif", background: "#f3f4f6", minHeight: "100vh" }}>
      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={handleReset} style={{ background: "white", border: `1.5px solid ${borderColor}`, borderRadius: 10, padding: "9px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", color: darkText }}>
          ← New Invoice
        </button>
        <button onClick={savePDF} disabled={saving} style={{ background: headerBg, color: "black", border: "none", borderRadius: 10, padding: "9px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving..." : "⬇ Save as PDF"}
        </button>
        <button onClick={saveImage} disabled={saving} style={{ background: "#374151", color: "white", border: "none", borderRadius: 10, padding: "9px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving..." : "🖼 Save as Image"}
        </button>
      </div>

      {/* Invoice Preview */}
      <div id="invoice-print" ref={invoiceRef} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.10)", border: `1px solid ${borderColor}` }}>

        {/* Invoice Header */}
        <div style={{ background: headerBg, padding: "28px 32px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 9, color: "#111827 ", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Issued by</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>ASIAN CONS & ENGG PTE LTD</div>
              <div style={{ fontSize: 11, color: "#111827", lineHeight: 1.8, marginTop: 4 }}>
                Co. Reg. No: 202334587K<br />
                7030 Ang Mo Kio Ave 5, #01-53, Singapore 569880<br />
                Tel: +65 8530 1773 &nbsp;|&nbsp; washingsolutionsg@gmail.com
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#4b5563", letterSpacing: 3 }}>INVOICE</div>
              <div style={{ background: accentColor, borderRadius: 8, padding: "4px 14px", display: "inline-block", marginTop: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>#{invNo}</span>
              </div>
              <div style={{ fontSize: 12, marginTop: 6, color: "#9ca3af" }}>{invoiceDate || "—"}</div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ background: lightBg, borderBottom: `1px solid ${borderColor}`, padding: "14px 32px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: mutedText, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Bill To</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: darkText }}>{displayName}</div>
          {toPhone && <div style={{ fontSize: 13, color: mutedText, marginTop: 3 }}>{toPhone}</div>}
          {toAddress && <div style={{ fontSize: 13, color: mutedText, marginTop: 2 }}>{toAddress}</div>}
        </div>

        {/* Items Table */}
        <div style={{ padding: "24px 32px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1e293b" }}>
                {["S/N", "DESCRIPTION", "AMOUNT ($)"].map((h, i) => (
                  <th key={h} style={{ color: "#e5e7eb", padding: "10px 14px", textAlign: i === 2 ? "right" : "left", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, width: i === 0 ? 40 : i === 2 ? 130 : "auto" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${borderColor}`, background: i % 2 === 0 ? "white" : lightBg }}>
                  <td style={{ padding: "12px 14px", fontSize: 14, color: mutedText, fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ padding: "12px 14px", fontSize: 14, color: darkText }}>
                    <div style={{ fontWeight: 600 }}>{item.description}</div>
                    {item.note && <div style={{ fontSize: 12, color: mutedText, marginTop: 3, fontStyle: "italic" }}>{item.note}</div>}
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 14, textAlign: "right", fontWeight: 600, color: darkText }}>
                    {item.amount ? `$${parseFloat(item.amount).toFixed(2)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <div style={{ background: headerBg, color: "white", borderRadius: 12, padding: "14px 24px", minWidth: 220, textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#9ca3af", letterSpacing: 1 }}>TOTAL AMOUNT</div>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 2 }}>${total.toFixed(2)}</div>
            </div>
          </div>

          {/* PayNow */}
          <div style={{ marginTop: 18, background: "#fff7ed", border: "1.5px solid #fed7aa", borderRadius: 10, padding: "11px 18px", display: "inline-block" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#92400e" }}>PAYNOW: </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: darkText }}>83714275K</span>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 32, borderTop: `1px solid ${borderColor}`, paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ fontSize: 15, fontStyle: "italic", color: mutedText }}>Thank you for your business!</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: darkText, marginBottom: 8 }}>For ASIAN CONS & ENGG PTE LTD</div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
                <svg width="130" height="46" viewBox="0 0 130 46" fill="none">
                  <path d="M6 36 C14 14, 26 8, 34 20 C39 28, 37 36, 44 26 C52 14, 56 6, 64 20 C70 30, 67 38, 75 26 C82 14, 87 6, 96 18 C102 28, 100 38, 108 28 C114 20, 118 14, 124 18" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M18 42 C40 39, 65 40, 90 39 C104 38, 116 39, 126 37" stroke="#1e293b" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.4" />
                </svg>
              </div>
              <div style={{ borderTop: `2px solid ${darkText}`, paddingTop: 6, fontSize: 11, color: mutedText }}>Authorized Signatory</div>
            </div>
          </div>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: mutedText, fontStyle: "italic", borderTop: `1px solid ${borderColor}`, paddingTop: 14 }}>
            Thank you for your business! · Asian Cons & Engg Pte Ltd <br /> Washingsolutionsg.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsianColor;