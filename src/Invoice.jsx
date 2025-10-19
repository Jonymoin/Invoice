import React from 'react';

export default function Invoice() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        {/* Header Section */}
        <div className="flex items-start justify-between p-8 border-b-2 border-gray-800">
          {/* Left Logo */}
          <div className="w-24 h-24 bg-gray-900 flex items-center justify-center">
            <div className="text-yellow-600 text-5xl font-bold">
              <svg viewBox="0 0 100 100" className="w-20 h-20">
                <path d="M20 80 L20 40 L50 20 L80 40 L80 80 M35 80 L35 55 L50 45 L65 55 L65 80 M50 45 L50 80" 
                      stroke="currentColor" strokeWidth="4" fill="none"/>
              </svg>
            </div>
          </div>

          {/* Center Company Info */}
          <div className="flex-1 text-center px-8">
            <h1 className="text-2xl font-bold text-blue-900 mb-1">
              ASIAN CONSTRUCTIONS &<br />ENGINEERING PTE.LTD
            </h1>
            <div className="text-xs text-gray-700 mt-3 space-y-1">
              <p>Company Registration No: 202334587K</p>
              <p>7030 Ang Mo Kio Ave 5, #01-53, Singapore 569880</p>
              <p>Tel: +65 6746 4786 Email: <span className="text-blue-600">asianconstruction1014@gmail.com</span></p>
            </div>
          </div>

          {/* Right Logo */}
          <div className="w-24 h-24 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20">
              <path d="M30 20 L50 50 L70 20 M40 40 L50 60 L60 40 M45 55 L50 70 L55 55" 
                    fill="#dc2626" stroke="#dc2626" strokeWidth="2"/>
              <text x="50" y="90" fontSize="14" textAnchor="middle" fill="#dc2626" fontWeight="bold">BCA</text>
            </svg>
          </div>
        </div>

        {/* Invoice Title and Date */}
        <div className="px-8 pt-6">
          <h2 className="text-2xl font-bold text-center underline mb-4">INVOICE</h2>
          <div className="text-right text-sm mb-6">
            <p>DATE: 01/10/2025</p>
            <p>INV NO: 436</p>
          </div>

          {/* To Section */}
          <div className="mb-6">
            <p className="font-bold italic mb-2">TO:</p>
            <p className="text-sm">416 choa chu kang ave 4</p>
            <p className="text-sm">#04-366</p>
            <p className="text-sm">Singapore 680416</p>
          </div>

          <p className="mb-4">Dear Sir,</p>

          {/* Invoice Table */}
          <table className="w-full border-2 border-gray-800 mb-6">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="border-r-2 border-gray-800 p-3 text-center w-20">S/N</th>
                <th className="border-r-2 border-gray-800 p-3 text-center">DESCRIPTION</th>
                <th className="p-3 text-center w-32">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b-2 border-gray-800" style={{ height: '150px' }}>
                <td className="border-r-2 border-gray-800 p-3 text-center align-top">1.</td>
                <td className="border-r-2 border-gray-800 p-3 align-top">Washing Machine Repair</td>
                <td className="p-3 text-center align-top">$130.00</td>
              </tr>
              <tr className="border-b-2 border-gray-800">
                <td className="border-r-2 border-gray-800 p-3"></td>
                <td className="border-r-2 border-gray-800 p-3 text-right font-bold italic pr-4">TOTAL</td>
                <td className="p-3 text-center font-bold">$130.00</td>
              </tr>
              <tr>
                <td className="border-r-2 border-gray-800 p-3"></td>
                <td className="border-r-2 border-gray-800 p-3"></td>
                <td className="p-3"></td>
              </tr>
            </tbody>
          </table>

          {/* Bank Details and QR Code */}
          <div className="flex justify-between items-start mb-8">
            <div className="text-sm space-y-1">
              <p><span className="font-bold">BANK ACCOUNT NO:</span> 595875907001</p>
              <p><span className="font-bold">BANK NAME :</span> OCBC</p>
              <p><span className="font-bold">PAYNOW :</span> 202334587K</p>
              <p className="font-bold mt-3">SCAN QR:</p>
              <div className="mt-2">
                <img src="/qr.png" alt="QR Code" className="w-32 h-32 object-contain" />
              </div>
            </div>

            <div className="text-right">
              <p className="mb-16">Thank you</p>
              <div className="mt-8 flex flex-col items-end">
                <img src="/sign.png" alt="Signature" className="w-32 h-16 object-contain mb-2" />
                <div className="border-b border-gray-400 w-48 mb-2"></div>
                <p className="text-sm font-bold">For ASIAN CONS & ENGG PTE LTD</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}