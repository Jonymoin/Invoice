import React, { useState, useRef } from "react";

const PREFIXES = ["Mr.", "Mrs.", "Ms.", "Dr.", "Engr."];

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
      const { default: html2canvas } = await import("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js").catch(() => ({ default: null }));
      if (!html2canvas) { alert("PDF library not available in this preview."); setSaving(false); return; }
      const { jsPDF } = await import("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js").catch(() => ({ jsPDF: null }));
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
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
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      document.head.appendChild(script);
      await new Promise((res) => { script.onload = res; });
      const canvas = await window.html2canvas(invoiceRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `Invoice-${invNo}-${toName || "Customer"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) { alert("Image save failed. Try again."); }
    setSaving(false);
  };

  const displayName = toName ? `${prefix} ${toName}` : prefix;

  // ── FORM VIEW ─────────────────────────────────────────────────────────
  if (!submitted) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans">
        <div className="max-w-2xl mx-auto">

          {/* Top bar */}
          <div className="bg-slate-800 rounded-2xl px-7 py-5 mb-6 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-0.5">Invoice Generator</p>
              <p className="text-white font-extrabold text-lg leading-tight">ASIAN CONS & ENGG PTE LTD</p>
            </div>
            <div className="text-right text-xs text-slate-400 leading-relaxed">
              <p>Co. Reg: 202334587K</p>
              <p>Tel: +65 8530 1773</p>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-7">

            {/* Invoice badge + number */}
            <div className="flex justify-between items-center mb-6">
              <span className="bg-orange-500 text-white font-extrabold tracking-widest text-lg px-5 py-1.5 rounded-xl">INVOICE</span>
              <div className="text-right text-sm text-gray-700">
                <span className="text-gray-400">INV NO: </span>
                <strong>#{invNo}</strong>
              </div>
            </div>

            {/* Section: Customer */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b-2 border-gray-200 pb-2 mb-4">Customer Information</p>

            <div className="flex gap-2 mb-3">
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold bg-gray-50 text-gray-800 cursor-pointer"
              >
                {PREFIXES.map((p) => <option key={p}>{p}</option>)}
              </select>
              <input
                type="text" placeholder="Customer Name (optional)" value={toName}
                onChange={(e) => setToName(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400"
              />
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text" placeholder="Phone (optional)" value={toPhone}
                onChange={(e) => setToPhone(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400"
              />
              <input
                type="text" placeholder="Address (optional)" value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400"
              />
            </div>

            <div className="flex gap-3 mb-6">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Invoice Date</label>
                <input
                  type="date" value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400"
                />
              </div>
              <div className="w-36">
                <label className="block text-xs text-gray-400 mb-1">Invoice No.</label>
                <input
                  type="text" value={invNo}
                  onChange={(e) => setInvNo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-orange-400"
                />
              </div>
            </div>

            {/* Section: Items */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b-2 border-gray-200 pb-2 mb-4">Items & Services</p>

            {items.map((item, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <input
                    type="text" placeholder="Description" value={item.description}
                    onChange={(e) => updateItem(i, "description", e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-semibold bg-white text-gray-800 outline-none focus:border-orange-400"
                  />
                  <input
                    type="number" placeholder="$0.00" value={item.amount}
                    onChange={(e) => updateItem(i, "amount", e.target.value)}
                    className="w-28 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-right bg-white text-gray-800 outline-none focus:border-orange-400"
                  />
                  {items.length > 1 && (
                    <button
                      onClick={() => removeRow(i)}
                      className="w-7 h-7 rounded-full bg-red-100 text-red-600 font-bold text-base flex items-center justify-center shrink-0 hover:bg-red-200"
                    >×</button>
                  )}
                </div>
                <textarea
                  placeholder={i === 0 ? "Add repair details..." : "Additional notes (optional)..."}
                  value={item.note}
                  onChange={(e) => updateItem(i, "note", e.target.value)}
                  rows={i === 0 ? 2 : 1}
                  className="w-full border border-dashed border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-500 bg-white resize-y outline-none"
                />
              </div>
            ))}

            <button
              onClick={addRow}
              className="bg-gray-100 text-gray-700 border border-gray-300 rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              ＋ Add Item
            </button>

            {/* Total row */}
            <div className="mt-5 bg-slate-800 rounded-xl px-6 py-4 flex justify-between items-center">
              <span className="text-slate-300 font-semibold text-sm">Total Amount</span>
              <span className="text-white font-extrabold text-2xl">${total.toFixed(2)}</span>
            </div>

            {/* Generate button */}
            <div className="mt-5 text-center">
              <button
                onClick={handleSubmit}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-xl px-10 py-3 transition-colors shadow-md"
              >
                Generate Invoice →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── INVOICE PREVIEW ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* Action buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={handleReset}
            className="bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-gray-50 transition-colors"
          >
            ← New Invoice
          </button>
          <button
            onClick={savePDF} disabled={saving}
            className="bg-slate-800 text-white font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-slate-700 disabled:opacity-60 transition-colors"
          >
            {saving ? "Saving..." : "⬇ Save as PDF"}
          </button>
          <button
            onClick={saveImage} disabled={saving}
            className="bg-gray-600 text-white font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-gray-500 disabled:opacity-60 transition-colors"
          >
            {saving ? "Saving..." : "🖼 Save as Image"}
          </button>
        </div>

        {/* Invoice card */}
        <div ref={invoiceRef} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">

          {/* Header */}
          <div className="bg-white px-8 py-7 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Issued by</p>
                <p className="text-lg font-extrabold text-slate-800">ASIAN CONS & ENGG PTE LTD</p>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  Co. Reg. No: 202334587K<br />
                  7030 Ang Mo Kio Ave 5, #01-53, Singapore 569880<br />
                  Tel: +65 8530 1773 &nbsp;|&nbsp; washingsolutionsg@gmail.com
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-gray-400 tracking-widest">INVOICE</p>
                <span className="bg-orange-500 text-white font-bold text-sm px-4 py-1 rounded-lg inline-block mt-1">
                  #{invNo}
                </span>
                <p className="text-xs text-gray-400 mt-2">{invoiceDate || "—"}</p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="bg-gray-50 border-b border-gray-200 px-8 py-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bill To</p>
            <p className="text-base font-extrabold text-gray-900">{displayName}</p>
            {toPhone && <p className="text-sm text-gray-500 mt-0.5">{toPhone}</p>}
            {toAddress && <p className="text-sm text-gray-500 mt-0.5">{toAddress}</p>}
          </div>

          {/* Items table */}
          <div className="px-8 py-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-800">
                  <th className="text-left text-gray-200 text-xs font-bold tracking-wide px-3.5 py-2.5 w-10">S/N</th>
                  <th className="text-left text-gray-200 text-xs font-bold tracking-wide px-3.5 py-2.5">DESCRIPTION</th>
                  <th className="text-right text-gray-200 text-xs font-bold tracking-wide px-3.5 py-2.5 w-32">AMOUNT ($)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    <td className="px-3.5 py-3 text-sm text-gray-400 font-semibold">{i + 1}</td>
                    <td className="px-3.5 py-3 text-sm text-gray-800">
                      <p className="font-semibold">{item.description}</p>
                      {item.note && <p className="text-xs text-gray-400 mt-0.5 italic">{item.note}</p>}
                    </td>
                    <td className="px-3.5 py-3 text-sm text-right font-semibold text-gray-800">
                      {item.amount ? `$${parseFloat(item.amount).toFixed(2)}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end mt-4">
              <div className="bg-slate-800 text-white rounded-xl px-6 py-4 min-w-[220px] text-right">
                <p className="text-xs text-slate-400 tracking-widest uppercase">Total Amount</p>
                <p className="text-3xl font-extrabold mt-1">${total.toFixed(2)}</p>
              </div>
            </div>

            {/* PayNow */}
            <div className="mt-5 bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 inline-block">
              <span className="text-xs font-bold text-orange-800">PAYNOW: </span>
              <span className="text-base font-bold text-gray-900">83714275K</span>
            </div>

            {/* Footer / Signature */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-end">
              <p className="text-sm text-gray-400 italic">Thank you for your business!</p>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800 mb-2">For ASIAN CONS & ENGG PTE LTD</p>
                <svg width="130" height="46" viewBox="0 0 130 46" fill="none" className="ml-auto mb-1">
                  <path d="M6 36 C14 14, 26 8, 34 20 C39 28, 37 36, 44 26 C52 14, 56 6, 64 20 C70 30, 67 38, 75 26 C82 14, 87 6, 96 18 C102 28, 100 38, 108 28 C114 20, 118 14, 124 18"
                    stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M18 42 C40 39, 65 40, 90 39 C104 38, 116 39, 126 37"
                    stroke="#1e293b" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.4" />
                </svg>
                <div className="border-t-2 border-gray-800 pt-1.5 text-xs text-gray-400">Authorized Signatory</div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 text-center text-xs text-gray-400 italic">
              Thank you for your business! · Asian Cons & Engg Pte Ltd · Washingsolutionsg.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsianInvoice;