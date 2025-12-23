import React, { useState } from "react";

const workGroupDefaults = [
  "Washing Machine Repair",
  "Plumbing Service",
  "Painting",
  "Transportation",
  "Others",
];

const Invoice4 = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");

  const [invoiceNo, setInvoiceNo] = useState("");
  const [toName, setToName] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [toAddress, setToAddress] = useState("");

  const [rows, setRows] = useState(
    workGroupDefaults.map((name) => ({
      name,
      description: "",
      qty: "",
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
  const gstRate = 0;
  const gst = subtotal * gstRate;
  const total = subtotal + gst;

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
    setRows(
      workGroupDefaults.map((name) => ({
        name,
        description: "",
        qty: "",
        amount: "",
      }))
    );
    setSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!submitted ? (
        /* FORM VIEW */
        <div className="bg-white p-6 shadow-xl rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold">
                <img src="/logo102.png" alt="" />
              </div>
              <div>
                <div className="text-lg font-bold">WasherTroubleshoot SG</div>
                <div className="text-xs text-gray-600">
                  Home repair & appliance service
                </div>
              </div>
            </div>

            <div className="text-right text-sm">
              <div className="font-bold">LSH ENGINEERING PRIVATE LIMITED</div>
              <div>
                707 JURONG WEST STREET 71, #06-48, SINGAPORE (640707)
              </div>
              <div>UEN: 201916839E</div>
              <div>Tel: +65 8413 0016</div>
              <div>Email: washertroubleshootsg@gmail.com</div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center mb-4">INVOICE</h2>

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Address
              </label>
              <input
                className="w-full border p-2 rounded mt-1"
                placeholder="Customer address"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-xs font-medium text-gray-700">
                  Invoice No
                </label>
                <input
                  className="w-full border p-2 rounded mt-1"
                  placeholder="e.g. 026"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-xs font-medium text-gray-700">
                  Date
                </label>
                <input
                  className="w-full border p-2 rounded mt-1"
                  value={formattedDate}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Name
              </label>
              <input
                className="w-full border p-2 rounded mt-1"
                placeholder="Customer name"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Tel.
              </label>
              <input
                className="w-full border p-2 rounded mt-1"
                placeholder="Phone number"
                value={toPhone}
                onChange={(e) => setToPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Work list */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left w-1/4">
                    Work Group List
                  </th>
                  <th className="border px-3 py-2 text-left">Description</th>
                  <th className="border px-3 py-2 text-right w-36">Qty</th>
                  <th className="border px-3 py-2 text-right w-40">
                    Amount (S$)
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td className="border px-3 py-2 align-top text-sm">
                      {r.name}
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="text"
                        placeholder={`Description for ${r.name}`}
                        className="w-full border p-2 rounded text-sm"
                        value={r.description}
                        onChange={(e) =>
                          updateRow(i, "description", e.target.value)
                        }
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="text"
                        placeholder="1"
                        className="w-full border p-2 rounded text-sm text-right"
                        value={r.qty}
                        onChange={(e) => updateRow(i, "qty", e.target.value)}
                      />
                    </td>
                    <td className="border px-3 py-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full border p-2 rounded text-sm text-right"
                        value={r.amount}
                        onChange={(e) =>
                          updateRow(i, "amount", e.target.value)
                        }
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
              <div className="font-semibold">
                Sub-Total: S${subtotal.toFixed(2)}
              </div>
              <div>GST: S${gst.toFixed(2)}</div>
              <div className="font-bold text-lg">
                Total: S${total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* INVOICE VIEW */
        <div className="bg-white p-6 shadow-2xl rounded-2xl border border-gray-200 relative">
          <div className="flex items-start justify-between border-b pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold">
                <img src="/logo102.png" alt="" />
              </div>
              <div>
                <div className="text-lg font-bold">WasherTroubleshoot SG</div>
                <div className="text-xs text-gray-600">
                  Home repair & appliance service
                </div>
              </div>
            </div>

            <div
              onClick={handleReset}
              className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-2xl cursor-pointer hover:bg-purple-700 transition"
              title="Click to reset invoice"
            >
              LE
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <div>
              <p className="font-semibold">TO:</p>
              <p>{toName}</p>
              <p>{toPhone}</p>
              {toAddress && <p>{toAddress}</p>}
            </div>

            <div className="text-right text-sm">
              <div className="font-bold text-2xl">LSH ENGINEERING PRIVATE LIMITED</div>
              <div>
                707 JURONG WEST STREET 71, #06-48, SINGAPORE (640707)
              </div>
              <div>UEN: 201916839E</div>
              <div>Tel: +65 8413 0016</div>
              <div>Email: washertroubleshootsg@gmail.com</div>
              <div className="mt-2">
                INV NO: <span className="font-semibold">{invoiceNo}</span>
              </div>
              <div>DATE: {formattedDate}</div>
            </div>
          </div>

          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2 text-left">S/N</th>
                <th className="border px-3 py-2 text-left">
                  Work / Description
                </th>
                <th className="border px-3 py-2 text-right w-20">Qty</th>
                <th className="border px-3 py-2 text-right w-40">
                  Amount (S$)
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="border px-3 py-2">{i + 1}</td>
                  <td className="border px-3 py-2">
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-sm text-gray-600">
                      {r.description}
                    </div>
                  </td>
                  <td className="border px-3 py-2 text-right">{r.qty}</td>
                  <td className="border px-3 py-2 text-right">
                    {r.amount
                      ? parseFloat(r.amount).toFixed(2)
                      : "0.00"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-6">
            <div className="w-1/2">
              <div className="mb-3 text-sm">
                <div>
                  <span className="font-semibold">Note :</span> Total Amount is
                  inclusive of GST.
                </div>
                <div className="mt-4 text-xm text-gray-800">
                <div className="font-semibold">PAYNOW: 83091653</div>
              </div>
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
                    <input type="checkbox" readOnly />{" "}
                    <span>Bank Transfer</span>
                  </label>
                </div>
                <div className="mt-3 text-sm">
                  
                </div>
              </div>

              <div className="text-sm">
                <div className="mb-2 font-semibold">
                  Work Completed & Checked by Customer
                </div>
                <div className="border-t pt-6 text-xs text-gray-600">
                  Customer has checked the work and is satisfied with the work
                  done prior to payment and signing the invoice.
                </div>
                <div className="mt-8">
                  <div className="italic">______________________________</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Customer Signature / Date
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 flex flex-col items-end">
              <div className="w-64 border-t pt-3 text-right">
                <div>Sub-Total: S${subtotal.toFixed(2)}</div>
                <div>GST: S${gst.toFixed(2)}</div>
                <div className="font-bold text-lg">
                  Total: S${total.toFixed(2)}
                </div>
              </div>

              
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-700">
            THANK YOU FOR YOUR BUSINESS!
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice4;
