import React, { useState } from "react";

const workGroupDefaults = [
  "Washing Machine Repair",
  "Plumbing Service",
  "Painting",
  "Others",
  "Transportation",
];

function getToday() {
  return new Date().toLocaleDateString("en-GB");
}

function dateToDash(dd_mm_yyyy) {
  const p = dd_mm_yyyy.split("/");
  if (p.length === 3)
    return `${p[2]}-${p[1].padStart(2, "0")}-${p[0].padStart(2, "0")}`;
  return "";
}

function dashToDisplay(yyyy_mm_dd) {
  const p = yyyy_mm_dd.split("-");
  if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
  return yyyy_mm_dd;
}

const Invoice4 = () => {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [date, setDate] = useState(getToday());

  const [rows, setRows] = useState(
    workGroupDefaults.map((name) => ({
      name,
      description: "",
      amount: "",
    }))
  );

  const [submitted, setSubmitted] = useState(false);

  const updateRow = (index, field, value) => {
    const copy = [...rows];
    copy[index] = { ...copy[index], [field]: value };
    setRows(copy);
  };

  const subtotal = rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const total = subtotal;

  const handleSubmit = () => {
    if (!toName || !toPhone || !invoiceNo) {
      alert("Please fill Invoice No, Customer Name and Phone before generating.");
      return;
    }
    setSubmitted(true);
  };

  const handleReset = () => {
    setInvoiceNo("");
    setToName("");
    setToPhone("");
    setToAddress("");
    setDate(getToday());
    setRows(workGroupDefaults.map((name) => ({ name, description: "", amount: "" })));
    setSubmitted(false);
  };

  const handleSaveImage = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const el = document.getElementById("inv-print");
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const link = document.createElement("a");
    link.download = `Invoice_${invoiceNo || "draft"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleSavePDF = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const el = document.getElementById("inv-print");
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const pW = pdf.internal.pageSize.getWidth();
    const pH = pdf.internal.pageSize.getHeight();
    const ratio = canvas.width / canvas.height;
    let w = pW - 40, h = w / ratio;
    if (h > pH - 40) { h = pH - 40; w = h * ratio; }
    pdf.addImage(imgData, "PNG", 20, 20, w, h);
    pdf.save(`Invoice_${invoiceNo || "draft"}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!submitted ? (
        /* ── FORM VIEW ── */
        <div className="bg-white p-6 shadow-xl rounded-2xl border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold">
                <img src="/logo102.png" alt="LSH" />
              </div>
              <div>
                <div className="text-lg font-bold">WasherTroubleshoot SG</div>
                <div className="text-xs text-gray-600">Home repair &amp; appliance service</div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="font-bold">LSH ENGINEERING PRIVATE LIMITED</div>
              <div>707 JURONG WEST STREET 71, #06-48, SINGAPORE (640707)</div>
              <div>UEN: 201916839E</div>
              <div>Tel: +65 8413 0016</div>
              <div>Email: washertroubleshootsg@gmail.com</div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center mb-4">INVOICE</h2>

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">Name</label>
              <input
                className="w-full border p-2 rounded mt-1"
                placeholder="Customer name"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-xs font-medium text-gray-700">Invoice No</label>
                <input
                  className="w-full border p-2 rounded mt-1"
                  placeholder="e.g. 026"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-medium text-gray-700">
                  Date <span className="text-gray-400 font-normal">(click to change)</span>
                </label>
                <input
                  type="date"
                  className="w-full border p-2 rounded mt-1 cursor-pointer"
                  value={dateToDash(date)}
                  onChange={(e) => setDate(dashToDisplay(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Tel.</label>
              <input
                className="w-full border p-2 rounded mt-1"
                placeholder="Phone number"
                value={toPhone}
                onChange={(e) => setToPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Address</label>
              <input
                className="w-full border p-2 rounded mt-1"
                placeholder="Customer address"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Work list — NO Qty column */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left w-1/4">Work Group List</th>
                  <th className="border px-3 py-2 text-left">Description</th>
                  <th className="border px-3 py-2 text-right w-40">Amount (S$)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td className="border px-3 py-2 align-top text-sm">{r.name}</td>
                    <td className="border px-3 py-2">
                      <input
                        type="text"
                        placeholder={`Description for ${r.name}`}
                        className="w-full border p-2 rounded text-sm"
                        value={r.description}
                        onChange={(e) => updateRow(i, "description", e.target.value)}
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full border p-2 rounded text-sm text-right"
                        value={r.amount}
                        onChange={(e) => updateRow(i, "amount", e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Generate Invoice
            </button>
            <div className="text-right text-sm">
              <div className="font-semibold">Sub-Total: S${subtotal.toFixed(2)}</div>
              <div>GST: S$0.00</div>
              <div className="font-bold text-lg">Total: S${total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      ) : (
        /* ── INVOICE VIEW ── */
        <div>
          {/* Save / Reset buttons — outside printable area */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleSaveImage}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
            >
              Save as Image
            </button>
            <button
              onClick={handleSavePDF}
              className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition text-sm"
            >
              Save as PDF
            </button>
            <button
              onClick={handleReset}
              className="border border-gray-300 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-sm"
            >
              New Invoice
            </button>
          </div>

          {/* Printable invoice */}
          <div
            id="inv-print"
            className="bg-white p-6 shadow-2xl rounded-2xl border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold">
                  <img src="/logo102.png" alt="LSH" />
                </div>
                <div>
                  <div className="text-lg font-bold">WasherTroubleshoot SG</div>
                  <div className="text-xs text-gray-600">Home repair &amp; appliance service</div>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="font-bold text-xl">LSH ENGINEERING PRIVATE LIMITED</div>
                <div>707 JURONG WEST STREET 71, #06-48, SINGAPORE (640707)</div>
                <div>UEN: 201916839E</div>
                <div>Tel: +65 8413 0016</div>
                <div>Email: washertroubleshootsg@gmail.com</div>
              </div>
            </div>

            {/* TO / Invoice meta */}
            <div className="flex justify-between mb-4">
              <div>
                <p className="font-semibold">TO:</p>
                <p>{toName}</p>
                <p>{toPhone}</p>
                {toAddress && <p>{toAddress}</p>}
              </div>
              <div className="text-right text-sm">
                <div className="mt-2">
                  INV NO: <span className="font-semibold">{invoiceNo}</span>
                </div>
                <div>DATE: {date}</div>
              </div>
            </div>

            {/* Items table — NO Qty column */}
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left w-8">S/N</th>
                  <th className="border px-3 py-2 text-left">Work / Description</th>
                  <th className="border px-3 py-2 text-right w-40">Amount (S$)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td className="border px-3 py-2">{i + 1}</td>
                    <td className="border px-3 py-2">
                      <div className="font-semibold">{r.name}</div>
                      <div className="text-sm text-gray-600">{r.description}</div>
                    </td>
                    <td className="border px-3 py-2 text-right">
                      {r.amount ? parseFloat(r.amount).toFixed(2) : "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bottom */}
            <div className="flex gap-6">
              <div className="w-1/2">
                <div className="mb-3 text-sm">
                  <span className="font-semibold">Note:</span> Total Amount is inclusive of GST.
                </div>
                <div className="mb-4">
                  <div className="mb-2 font-semibold">Payment by:</div>
                  <div className="flex items-center gap-3 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" readOnly /> <span>Cash</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" readOnly /> <span>PayNow</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" readOnly /> <span>UEN: 201916839E</span>
                    </label>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="mb-2 font-semibold">Work Completed &amp; Checked by Customer</div>
                  <div className="border-t pt-6 text-xs text-gray-600">
                    Customer has checked the work and is satisfied with the work done prior to
                    payment and signing the invoice.
                  </div>
                  <div className="mt-8">
                    <div className="italic">______________________________</div>
                    <div className="text-xs text-gray-500 mt-1">Customer Signature / Date</div>
                  </div>
                </div>
              </div>

              <div className="w-1/2 flex flex-col items-end">
                <div className="w-64 border-t pt-3 text-right">
                  <div>Sub-Total: S${subtotal.toFixed(2)}</div>
                  <div>GST: S$0.00</div>
                  <div className="font-bold text-lg">Total: S${total.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-700">
              THANK YOU FOR YOUR BUSINESS!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice4;