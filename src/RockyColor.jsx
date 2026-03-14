import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const PREFIXES = ["Mr.", "Mrs.", "Ms.", "Dr.", "Engr."];
const workGroups = [
  "Washing Machine Repair",
  "Plumbing Service",
  "Painting",
  "Others",
  "Transportation",
];

const gradBg = "linear-gradient(135deg, #1e3a8a, #065f46)";
const accentOrange = "#ea580c";

const RockyColor = () => {
  const today = new Date().toLocaleDateString("en-GB");
  const [prefix, setPrefix] = useState("Mr.");
  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [toAddress, setToAddress] = useState("");
  const invoiceNo = "46";
  const [rows, setRows] = useState(
    workGroups.map((n) => ({ name: n, description: "", amount: "" }))
  );
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const invoiceRef = useRef(null);

  const updateRow = (i, field, val) => {
    const c = [...rows];
    c[i] = { ...c[i], [field]: val };
    setRows(c);
  };

  const subtotal = rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const total = subtotal;

  const handleSubmit = () => setSubmitted(true);

  const handleReset = () => {
    setPrefix("Mr.");
    setToName("");
    setToPhone("");
    setToAddress("");
    setRows(workGroups.map((n) => ({ name: n, description: "", amount: "" })));
    setSubmitted(false);
  };

  const savePDF = async () => {
    setSaving(true);
    try {
      const el = invoiceRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        onclone: (doc) => {
          const cloned = doc.getElementById("invoice-print");
          if (cloned) cloned.style.borderRadius = "0";
        },
      });
      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const iw = pw - 16;
      const ih = (canvas.height * iw) / canvas.width;
      const y = ih < ph ? (ph - ih) / 2 : 8;
      pdf.addImage(imgData, "PNG", 8, y, iw, Math.min(ih, ph - 16));
      pdf.save(`Invoice-${invoiceNo}-${toName || "Customer"}.pdf`);
    } catch (e) {
      console.error(e);
      alert("PDF save failed: " + e.message);
    }
    setSaving(false);
  };

  const displayName = toName ? `${prefix} ${toName}` : prefix;

  // ========================
  // FORM VIEW
  // ========================
  if (!submitted) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ background: gradBg, borderRadius: 16, padding: "22px 28px", marginBottom: 24, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>LSH ENGINEERING PTE LTD</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>WasherTroubleshoot SG · Home repair & appliance service</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 12, opacity: 0.85, lineHeight: 1.7 }}>
            <div>UEN: 201916839E</div>
            <div>Tel: +65 8413 0016</div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ background: accentOrange, color: "white", borderRadius: 10, padding: "6px 20px", fontWeight: 800, fontSize: 20, letterSpacing: 2 }}>INVOICE</div>
            <div style={{ textAlign: "right", fontSize: 13 }}>
              <div><span style={{ color: "#64748b" }}>INV NO: </span><strong>#{invoiceNo}</strong></div>
              <div><span style={{ color: "#64748b" }}>DATE: </span><strong>{today}</strong></div>
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "#1e3a8a", textTransform: "uppercase", letterSpacing: 1, borderBottom: "2px solid #1e3a8a", paddingBottom: 6, marginBottom: 14 }}>Customer Information</div>

          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <select value={prefix} onChange={(e) => setPrefix(e.target.value)}
              style={{ width: 105, border: "1.5px solid #bfdbfe", borderRadius: 8, padding: "8px 10px", fontSize: 14, background: "#eff6ff", color: "#1e40af", fontWeight: 700, cursor: "pointer" }}>
              {PREFIXES.map((p) => <option key={p}>{p}</option>)}
            </select>
            <input type="text" placeholder="Customer Name (optional)" value={toName}
              onChange={(e) => setToName(e.target.value)}
              style={{ flex: 1, border: "1.5px solid #bfdbfe", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }} />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input type="text" placeholder="Phone (optional)" value={toPhone}
              onChange={(e) => setToPhone(e.target.value)}
              style={{ flex: 1, border: "1.5px solid #bfdbfe", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }} />
            <input type="text" placeholder="Address (optional)" value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              style={{ flex: 1, border: "1.5px solid #bfdbfe", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none" }} />
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: "#065f46", textTransform: "uppercase", letterSpacing: 1, borderBottom: "2px solid #065f46", paddingBottom: 6, marginBottom: 14 }}>Work Items</div>

          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10, background: i % 2 === 0 ? "#f0fdf4" : "#fefce8", border: `1.5px solid ${i % 2 === 0 ? "#bbf7d0" : "#fde68a"}`, borderRadius: 10, padding: "10px 14px" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: gradBg, color: "white", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ width: 170, fontSize: 13, fontWeight: 700, color: "#1e293b", flexShrink: 0 }}>{r.name}</div>
              <input type="text" placeholder="Description..." value={r.description}
                onChange={(e) => updateRow(i, "description", e.target.value)}
                style={{ flex: 1, border: "1.5px solid #cbd5e1", borderRadius: 8, padding: "7px 10px", fontSize: 13, background: "white", outline: "none" }} />
              <input type="number" placeholder="S$0.00" value={r.amount}
                onChange={(e) => updateRow(i, "amount", e.target.value)}
                style={{ width: 110, border: "1.5px solid #cbd5e1", borderRadius: 8, padding: "7px 10px", fontSize: 13, textAlign: "right", background: "white", outline: "none" }} />
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <div style={{ background: gradBg, color: "white", borderRadius: 12, padding: "14px 24px", minWidth: 200, textAlign: "right" }}>
              <div style={{ fontSize: 12, opacity: 0.75 }}>TOTAL AMOUNT</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>S${total.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button onClick={handleSubmit}
              style={{ background: gradBg, color: "white", border: "none", borderRadius: 12, padding: "13px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
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
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={handleReset}
          style={{ background: "#f1f5f9", border: "1.5px solid #cbd5e1", borderRadius: 10, padding: "9px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#475569" }}>
          ← New Invoice
        </button>
        <button onClick={savePDF} disabled={saving}
          style={{ background: gradBg, color: "white", border: "none", borderRadius: 10, padding: "9px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving..." : "⬇ Save as PDF"}
        </button>
      </div>

      <div id="invoice-print" ref={invoiceRef}
        style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>

        {/* Header */}
        <div style={{ background: gradBg, padding: "24px 32px", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 9, opacity: 0.7, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Issued by</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>LSH ENGINEERING PRIVATE LIMITED</div>
              <div style={{ fontSize: 11, opacity: 0.85, lineHeight: 1.8, marginTop: 4 }}>
                707 Jurong West Street 71, #06-48, Singapore (640707)<br />
                UEN: 201916839E · Tel: +65 8413 0016<br />
                washertroubleshootsg@gmail.com
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 32, fontWeight: 900, opacity: 0.2, letterSpacing: 4 }}>INVOICE</div>
              <div style={{ background: accentOrange, borderRadius: 8, padding: "4px 14px", display: "inline-block", marginTop: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>#{invoiceNo}</span>
              </div>
              <div style={{ fontSize: 12, marginTop: 6, opacity: 0.9 }}>{today}</div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "14px 32px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Bill To</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1e293b" }}>{displayName}</div>
          {toPhone && <div style={{ fontSize: 13, color: "#475569", marginTop: 3 }}>{toPhone}</div>}
          {toAddress && <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>{toAddress}</div>}
        </div>

        {/* Table */}
        <div style={{ padding: "24px 32px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: gradBg }}>
                {["S/N", "WORK GROUP", "DESCRIPTION", "AMOUNT (S$)"].map((h, i) => (
                  <th key={h} style={{ color: "white", padding: "10px 14px", textAlign: i === 3 ? "right" : "left", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, width: i === 0 ? 36 : i === 1 ? 180 : i === 3 ? 130 : "auto" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#f8faff" }}>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{r.name}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, color: "#475569" }}>{r.description || "—"}</td>
                  <td style={{ padding: "11px 14px", fontSize: 13, textAlign: "right", fontWeight: 600, color: "#1e293b" }}>
                    {r.amount ? `S$${parseFloat(r.amount).toFixed(2)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bottom */}
          <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
            {/* Left */}
            <div style={{ flex: 1 }}>
              <div style={{ background: "#fffbeb", border: "1.5px solid #fde68a", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Payment Method</div>
                <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                  {["Cash", "PayNow", "UEN: 201916839E"].map((m) => (
                    <label key={m} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <input type="checkbox" readOnly />
                      <span style={{ color: "#1e293b" }}>{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
                <span style={{ fontWeight: 700, color: "#1e293b" }}>Note:</span> Total amount is inclusive of GST.
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Work Completed & Checked by Customer</div>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 32 }}>Customer has checked the work and is satisfied prior to payment and signing.</div>
                <div style={{ borderTop: "1.5px solid #cbd5e1", paddingTop: 6, fontSize: 11, color: "#94a3b8" }}>Customer Signature / Date</div>
              </div>
            </div>

            {/* Right */}
            <div style={{ width: 220, display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ background: gradBg, color: "white", borderRadius: 12, padding: "16px 20px", width: "100%", textAlign: "right" }}>
                <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>Sub-Total</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>S${subtotal.toFixed(2)}</div>
                <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>GST: S$0.00</div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: 10 }}>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>TOTAL AMOUNT</div>
                  <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4 }}>S${total.toFixed(2)}</div>
                </div>
              </div>

              <div style={{ marginTop: 24, textAlign: "right", width: "100%" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>For LSH ENGINEERING PTE LTD</div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
                  <svg width="130" height="46" viewBox="0 0 130 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 36 C14 14, 26 8, 34 20 C39 28, 37 36, 44 26 C52 14, 56 6, 64 20 C70 30, 67 38, 75 26 C82 14, 87 6, 96 18 C102 28, 100 38, 108 28 C114 20, 118 14, 124 18"
                      stroke="#1e3a8a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <path d="M18 42 C40 39, 65 40, 90 39 C104 38, 116 39, 126 37"
                      stroke="#1e3a8a" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.4" />
                  </svg>
                </div>
                <div style={{ borderTop: "2px solid #1e3a8a", paddingTop: 6, fontSize: 11, color: "#94a3b8" }}>Authorized Signatory</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "#94a3b8", fontStyle: "italic", borderTop: "1px solid #f1f5f9", paddingTop: 14 }}>
            Thank you for your business! · WasherTroubleshootSG.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default RockyColor;