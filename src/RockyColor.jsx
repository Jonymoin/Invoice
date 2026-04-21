import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const PREFIXES = ["Mr.", "Mrs.", "Ms.", "Dr.", "Engr."];
const workGroups = ["Washing Machine Repair", "Plumbing Service", "Painting", "Others", "Transportation"];

const RockyColor = () => {
  const today = new Date().toLocaleDateString("en-GB");
  const [prefix, setPrefix] = useState("Mr.");
  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [toAddress, setToAddress] = useState("");
  const invoiceNo = "46";
  const [rows, setRows] = useState(workGroups.map((n) => ({ name: n, description: "", amount: "" })));
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
      pdf.save(`Invoice-${invoiceNo}-${toName || "Customer"}.pdf`);
    } catch (e) {
      alert("PDF save failed. Try again.");
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
      link.download = `Invoice-${invoiceNo}-${toName || "Customer"}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Image save failed. Try again.");
    }
    setSaving(false);
  };

  const displayName = toName ? `${prefix} ${toName}` : prefix;

  const field = {
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "8px 10px",
    fontSize: 13,
    outline: "none",
    background: "white",
    color: "#111",
  };

  const btnPrimary = {
    background: "white",
    color: "#111",
    border: "1.5px solid #111",
    borderRadius: 8,
    padding: "9px 22px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  };

  const sectionLabel = {
    fontSize: 11,
    fontWeight: 700,
    color: "#111",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "1.5px solid #111",
    paddingBottom: 5,
    marginBottom: 14,
  };

  // ─── FORM VIEW ───────────────────────────────────────────────
  if (!submitted) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px", fontFamily: "'Segoe UI', sans-serif", background: "white", color: "#111" }}>

        {/* Company Header */}
        <div style={{ borderBottom: "2px solid #111", paddingBottom: 14, marginBottom: 22 }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>LSH ENGINEERING PTE LTD</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>WasherTroubleshoot SG · Home repair & appliance service</div>
          <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>UEN: 201916839E · Tel: +65 8413 0016</div>
        </div>

        {/* Invoice title + number */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 3 }}>INVOICE</div>
          <div style={{ fontSize: 13, textAlign: "right" }}>
            <div>INV NO: <strong>#{invoiceNo}</strong></div>
            <div>DATE: <strong>{today}</strong></div>
          </div>
        </div>

        {/* Customer Info */}
        <div style={sectionLabel}>Customer Information</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <select value={prefix} onChange={(e) => setPrefix(e.target.value)} style={{ ...field, width: 110 }}>
            {PREFIXES.map((p) => <option key={p}>{p}</option>)}
          </select>
          <input type="text" placeholder="Customer Name (optional)" value={toName} onChange={(e) => setToName(e.target.value)} style={{ ...field, flex: 1 }} />
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <input type="text" placeholder="Phone (optional)" value={toPhone} onChange={(e) => setToPhone(e.target.value)} style={{ ...field, flex: 1 }} />
          <input type="text" placeholder="Address (optional)" value={toAddress} onChange={(e) => setToAddress(e.target.value)} style={{ ...field, flex: 1 }} />
        </div>

        {/* Work Items */}
        <div style={sectionLabel}>Work Items</div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, background: i % 2 === 0 ? "#f9f9f9" : "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: "9px 12px" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#111", color: "white", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
            <div style={{ width: 165, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{r.name}</div>
            <input type="text" placeholder="Description..." value={r.description} onChange={(e) => updateRow(i, "description", e.target.value)} style={{ ...field, flex: 1 }} />
            <input type="number" placeholder="S$0.00" value={r.amount} onChange={(e) => updateRow(i, "amount", e.target.value)} style={{ ...field, width: 105, textAlign: "right" }} />
          </div>
        ))}

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <div style={{ border: "2px solid #111", borderRadius: 10, padding: "14px 22px", minWidth: 190, textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#555" }}>TOTAL AMOUNT</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>S${total.toFixed(2)}</div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button onClick={handleSubmit} style={{ ...btnPrimary, padding: "13px 44px", fontSize: 15, fontWeight: 700 }}>
            Generate Invoice →
          </button>
        </div>
      </div>
    );
  }

  // ─── INVOICE VIEW ─────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 16px", fontFamily: "'Segoe UI', sans-serif", background: "white", color: "#111" }}>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={handleReset} style={{ ...btnPrimary }}>← New Invoice</button>
        <button onClick={savePDF} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.5 : 1 }}>
          {saving ? "Saving..." : "⬇ Save as PDF"}
        </button>
        <button onClick={saveImage} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.5 : 1 }}>
          {saving ? "Saving..." : "🖼 Save as Image"}
        </button>
      </div>

      {/* ── Printable Invoice ── */}
      <div ref={invoiceRef} style={{ background: "white", border: "1.5px solid #ccc", borderRadius: 12, overflow: "hidden", fontFamily: "'Segoe UI', sans-serif", color: "#111" }}>

        {/* Header — white bg */}
        <div style={{ background: "white", borderBottom: "2px solid #111", padding: "22px 30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 9, color: "#888", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>Issued by</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>LSH ENGINEERING PRIVATE LIMITED</div>
              <div style={{ fontSize: 11, color: "#444", lineHeight: 1.8, marginTop: 4 }}>
                707 Jurong West Street 71, #06-48, Singapore (640707)<br />
                UEN: 201916839E · Tel: +65 8413 0016<br />
                washertroubleshootsg@gmail.com
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#ddd", letterSpacing: 4 }}>INVOICE</div>
              <div style={{ border: "1.5px solid #111", borderRadius: 6, padding: "3px 14px", display: "inline-block", marginTop: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>#{invoiceNo}</span>
              </div>
              <div style={{ fontSize: 12, marginTop: 6, color: "#555" }}>{today}</div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ background: "#f8f8f8", borderBottom: "1px solid #ddd", padding: "13px 30px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>Bill To</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>{displayName}</div>
          {toPhone && <div style={{ fontSize: 13, color: "#555", marginTop: 2 }}>{toPhone}</div>}
          {toAddress && <div style={{ fontSize: 13, color: "#555", marginTop: 1 }}>{toAddress}</div>}
        </div>

        {/* Table */}
        <div style={{ padding: "22px 30px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #111" }}>
                {["S/N", "WORK GROUP", "DESCRIPTION", "AMOUNT (S$)"].map((h, i) => (
                  <th key={h} style={{ padding: "9px 12px", textAlign: i === 3 ? "right" : "left", fontSize: 11, fontWeight: 700, color: "#111", width: i === 0 ? 36 : i === 1 ? 175 : i === 3 ? 130 : "auto" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #eee", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#aaa", fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: "#111" }}>{r.name}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#555" }}>{r.description || "—"}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, textAlign: "right", fontWeight: 600, color: "#111" }}>
                    {r.amount ? `S$${parseFloat(r.amount).toFixed(2)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Row */}
          <div style={{ display: "flex", gap: 20, marginTop: 22 }}>

            {/* Left: payment + customer signature */}
            <div style={{ flex: 1 }}>
              <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: "11px 14px", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 7, textTransform: "uppercase", letterSpacing: 0.5 }}>Payment Method</div>
                <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#111" }}>
                  {["Cash", "PayNow", "UEN: 201916839E"].map((m) => (
                    <label key={m} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <input type="checkbox" readOnly /> <span>{m}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 14 }}>
                <span style={{ fontWeight: 700, color: "#111" }}>Note:</span> Total amount is inclusive of GST.
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111", marginBottom: 8 }}>Work Completed & Checked by Customer</div>
                <div style={{ fontSize: 11, color: "#777", marginBottom: 30 }}>Customer has checked the work and is satisfied prior to payment and signing.</div>
                <div style={{ borderTop: "1px solid #ccc", paddingTop: 5, fontSize: 11, color: "#aaa" }}>Customer Signature / Date</div>
              </div>
            </div>

            {/* Right: totals + authorized signatory */}
            <div style={{ width: 210, display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ border: "1.5px solid #111", borderRadius: 10, padding: "14px 18px", width: "100%", textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#777", marginBottom: 3 }}>Sub-Total</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 5 }}>S${subtotal.toFixed(2)}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 7 }}>GST: S$0.00</div>
                <div style={{ borderTop: "1px solid #ddd", paddingTop: 9 }}>
                  <div style={{ fontSize: 11, color: "#555" }}>TOTAL AMOUNT</div>
                  <div style={{ fontSize: 24, fontWeight: 900, marginTop: 3, color: "#111" }}>S${total.toFixed(2)}</div>
                </div>
              </div>
              <div style={{ marginTop: 20, textAlign: "right", width: "100%" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111", marginBottom: 7 }}>For LSH ENGINEERING PTE LTD</div>
                <svg width="120" height="42" viewBox="0 0 130 46" fill="none">
                  <path d="M6 36 C14 14,26 8,34 20 C39 28,37 36,44 26 C52 14,56 6,64 20 C70 30,67 38,75 26 C82 14,87 6,96 18 C102 28,100 38,108 28 C114 20,118 14,124 18" stroke="#111" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M18 42 C40 39,65 40,90 39 C104 38,116 39,126 37" stroke="#111" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35" />
                </svg>
                <div style={{ borderTop: "1.5px solid #111", paddingTop: 5, fontSize: 11, color: "#aaa" }}>Authorized Signatory</div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ marginTop: 18, textAlign: "center", fontSize: 13, color: "#aaa", fontStyle: "italic", borderTop: "1px solid #eee", paddingTop: 12 }}>
            Thank you for your business! · WasherTroubleshoot SG
          </div>
        </div>
      </div>
    </div>
  );
};

export default RockyColor;