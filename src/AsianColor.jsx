import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const PREFIXES = ["Mr.", "Mrs.", "Ms.", "Dr.", "Engr."];

const SignatureSVG = () => (
  <svg width="130" height="50" viewBox="0 0 130 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 38 C14 16, 26 10, 34 22 C39 30, 37 38, 44 28 C52 16, 56 8, 64 22 C70 32, 67 40, 75 28 C82 16, 87 8, 96 20 C102 30, 100 40, 108 30 C114 22, 118 16, 124 20"
      stroke="#1a3a7a" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M18 44 C40 41, 65 42, 90 41 C104 40, 116 41, 126 39"
      stroke="#1a3a7a" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45"/>
  </svg>
);

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
      const el = invoiceRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW - 20;
      const imgH = (canvas.height * imgW) / canvas.width;
      const y = imgH < pageH ? (pageH - imgH) / 2 : 10;
      pdf.addImage(imgData, "PNG", 10, y, imgW, Math.min(imgH, pageH - 20));
      pdf.save(`Invoice-${invNo}-${toName || "Customer"}.pdf`);
    } catch (e) {
      alert("PDF save failed. Please try again.");
    }
    setSaving(false);
  };

  const displayName = toName ? `${prefix} ${toName}` : prefix;

  // ========================
  // FORM VIEW
  // ========================
  if (!submitted) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1a4fa0, #0e8a6e)", borderRadius: 16, padding: "24px 28px", marginBottom: 24, color: "white" }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>🧾 Invoice Generator</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>Asian Cons & Engg Pte Ltd</div>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>

          {/* Customer Info */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a4fa0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, borderBottom: "2px solid #1a4fa0", paddingBottom: 6 }}>
              Customer Information
            </div>

            {/* Prefix + Name */}
            <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                style={{ width: 105, border: "1.5px solid #c7d2fe", borderRadius: 8, padding: "8px 10px", fontSize: 14, background: "#eef2ff", color: "#3730a3", fontWeight: 600, cursor: "pointer" }}
              >
                {PREFIXES.map((p) => <option key={p}>{p}</option>)}
              </select>
              <input
                type="text"
                placeholder="Customer Name (optional)"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                style={{ flex: 1, border: "1.5px solid #c7d2fe", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }}
              />
            </div>

            <input type="text" placeholder="Phone Number (optional)" value={toPhone}
              onChange={(e) => setToPhone(e.target.value)}
              style={{ width: "100%", border: "1.5px solid #c7d2fe", borderRadius: 8, padding: "8px 12px", fontSize: 14, marginBottom: 10, outline: "none" }} />

            <input type="text" placeholder="Address (optional)" value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              style={{ width: "100%", border: "1.5px solid #c7d2fe", borderRadius: 8, padding: "8px 12px", fontSize: 14, marginBottom: 10, outline: "none" }} />

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: "#64748b", marginBottom: 4, display: "block" }}>Invoice Date</label>
                <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)}
                  style={{ width: "100%", border: "1.5px solid #c7d2fe", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }} />
              </div>
              <div style={{ width: 140 }}>
                <label style={{ fontSize: 12, color: "#64748b", marginBottom: 4, display: "block" }}>Invoice No.</label>
                <input type="text" value={invNo} onChange={(e) => setInvNo(e.target.value)}
                  style={{ width: "100%", border: "1.5px solid #c7d2fe", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }} />
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0e8a6e", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, borderBottom: "2px solid #0e8a6e", paddingBottom: 6 }}>
              Items & Services
            </div>

            {items.map((item, i) => (
              <div key={i} style={{
                background: i === 0 ? "#f0fdf9" : i === 1 ? "#fff7ed" : "#f8fafc",
                border: `1.5px solid ${i === 0 ? "#6ee7b7" : i === 1 ? "#fcd34d" : "#e2e8f0"}`,
                borderRadius: 12, padding: "14px 16px", marginBottom: 12
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: i === 0 ? "#0e8a6e" : i === 1 ? "#d97706" : "#64748b", color: "white", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {i + 1}
                  </span>
                  <input type="text" placeholder="Description" value={item.description}
                    onChange={(e) => updateItem(i, "description", e.target.value)}
                    style={{ flex: 1, border: "1.5px solid #cbd5e1", borderRadius: 8, padding: "7px 10px", fontSize: 14, fontWeight: 600, background: "white", outline: "none" }} />
                  <input type="number" placeholder="$0.00" value={item.amount}
                    onChange={(e) => updateItem(i, "amount", e.target.value)}
                    style={{ width: 110, border: "1.5px solid #cbd5e1", borderRadius: 8, padding: "7px 10px", fontSize: 14, textAlign: "right", background: "white", outline: "none" }} />
                  {items.length > 1 && (
                    <button onClick={() => removeRow(i)} style={{ width: 28, height: 28, borderRadius: "50%", background: "#fee2e2", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>×</button>
                  )}
                </div>
                <textarea
                  placeholder={i === 0 ? "Add repair details... (e.g. replaced motor, cleaned drum)" : "Additional notes (optional)..."}
                  value={item.note}
                  onChange={(e) => updateItem(i, "note", e.target.value)}
                  rows={i === 0 ? 2 : 1}
                  style={{ width: "100%", border: `1.5px dashed ${i === 0 ? "#6ee7b7" : "#e2e8f0"}`, borderRadius: 8, padding: "8px 10px", fontSize: 13, color: i === 0 ? "#065f46" : "#475569", background: "white", resize: "vertical", outline: "none", fontFamily: "inherit" }}
                />
              </div>
            ))}

            <button onClick={addRow} style={{ background: "linear-gradient(135deg, #1a4fa0, #0e8a6e)", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              ＋ Add Item
            </button>
          </div>

          {/* Total Preview */}
          <div style={{ marginTop: 20, background: "linear-gradient(135deg, #1a4fa0, #0e8a6e)", borderRadius: 12, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "white" }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Total Amount</span>
            <span style={{ fontSize: 22, fontWeight: 700 }}>${total.toFixed(2)}</span>
          </div>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button onClick={handleSubmit} style={{ background: "linear-gradient(135deg, #059669, #1a4fa0)", color: "white", border: "none", borderRadius: 12, padding: "14px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Generate Invoice →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // INVOICE VIEW
  // ========================
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={handleReset} style={{ background: "#f1f5f9", border: "1.5px solid #cbd5e1", borderRadius: 10, padding: "9px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#475569" }}>
          ← New Invoice
        </button>
        <button onClick={savePDF} disabled={saving} style={{ background: "linear-gradient(135deg, #1a4fa0, #0e8a6e)", color: "white", border: "none", borderRadius: 10, padding: "9px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving..." : "⬇ Save as PDF"}
        </button>
      </div>

      {/* Printable Invoice */}
      <div ref={invoiceRef} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #e2e8f0" }}>

        {/* Invoice Header */}
        <div style={{ background: "linear-gradient(135deg, #1a4fa0, #0e8a6e)", padding: "28px 32px 24px", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>ASIAN CONS & ENGG PTE LTD</div>
              <div style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.8 }}>
                Co. Reg. No: 202334587K<br />
                7030 Ang Mo Kio Ave 5, #01-53, Singapore 569880<br />
                Tel: +65 8530 1773 &nbsp;|&nbsp; washingrepairsg@gmail.com
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 26, fontWeight: 800, opacity: 0.22, letterSpacing: 3 }}>INVOICE</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>INV NO: {invNo}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>DATE: {invoiceDate || "—"}</div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ padding: "18px 32px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Bill To</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{displayName}</div>
          {toPhone && <div style={{ fontSize: 14, color: "#475569", marginTop: 3 }}>{toPhone}</div>}
          {toAddress && <div style={{ fontSize: 14, color: "#475569", marginTop: 2 }}>{toAddress}</div>}
        </div>

        {/* Items Table */}
        <div style={{ padding: "24px 32px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #1a4fa0, #0e8a6e)" }}>
                <th style={{ color: "white", padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, width: 42 }}>S/N</th>
                <th style={{ color: "white", padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 700 }}>DESCRIPTION</th>
                <th style={{ color: "white", padding: "10px 14px", textAlign: "right", fontSize: 12, fontWeight: 700, width: 130 }}>AMOUNT ($)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}>
                  <td style={{ padding: "12px 14px", fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ padding: "12px 14px", fontSize: 14, color: "#1e293b" }}>
                    <div style={{ fontWeight: 600 }}>{item.description}</div>
                    {item.note && <div style={{ fontSize: 12, color: "#64748b", marginTop: 3, fontStyle: "italic" }}>{item.note}</div>}
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 14, textAlign: "right", fontWeight: 600, color: "#1e293b" }}>
                    {item.amount ? `$${parseFloat(item.amount).toFixed(2)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <div style={{ background: "linear-gradient(135deg, #1a4fa0, #0e8a6e)", color: "white", borderRadius: 12, padding: "14px 24px", minWidth: 220, textAlign: "right" }}>
              <div style={{ fontSize: 12, opacity: 0.8, letterSpacing: 1 }}>TOTAL AMOUNT</div>
              <div style={{ fontSize: 26, fontWeight: 800, marginTop: 2 }}>${total.toFixed(2)}</div>
            </div>
          </div>

          {/* PayNow */}
          <div style={{ marginTop: 18, background: "#fff7ed", border: "1.5px solid #fcd34d", borderRadius: 10, padding: "11px 18px", display: "inline-block" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#92400e" }}>PAYNOW: </span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>83714275K</span>
          </div>

          {/* Footer with Signature */}
          <div style={{ marginTop: 32, borderTop: "1px solid #e2e8f0", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ fontSize: 15, fontStyle: "italic", color: "#64748b" }}>Thank you for your business!</div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>For ASIAN CONS & ENGG PTE LTD</div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
                <SignatureSVG />
              </div>
              <div style={{ borderTop: "1.5px solid #1a4fa0", paddingTop: 6 }}>
                <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 0.5 }}>Authorized Signatory</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AsianColor;