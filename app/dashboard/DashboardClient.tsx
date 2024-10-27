// 'use client'

// import React, { useState, useEffect } from 'react';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

// const initialAgent = { name: '', seat: '', amount: '', percentage: '', commission: '', total: '' };
// const initialBusData = {
//   vehicleNumber: '',
//   route: '',
//   driverName: '',
//   pickupMan: '',
//   agents: Array(7).fill(null).map(() => ({...initialAgent})),
//   ho: { ...initialAgent, name: 'HO' },
//   online: { ...initialAgent, name: 'Online' },
//   advanceReport: '',
//   customBox: '',
// };

// export default function DashboardClient() {
//   const [activeTab, setActiveTab] = useState('bus-wise');
//   const [buses, setBuses] = useState(Array(9).fill(null).map(() => JSON.parse(JSON.stringify(initialBusData))));
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

//   useEffect(() => {
//     const savedData = localStorage.getItem('busData');
//     if (savedData) {
//       setBuses(JSON.parse(savedData));
//     }
//   }, []);

//   const saveData = () => {
//     localStorage.setItem('busData', JSON.stringify(buses));
//     alert('Data saved successfully!');
//   };

//   const eraseData = () => {
//     if (window.confirm('Are you sure you want to erase all data?')) {
//       localStorage.removeItem('busData');
//       setBuses(Array(9).fill(null).map(() => JSON.parse(JSON.stringify(initialBusData))));
//     }
//   };

//   const updateBus = (index, field, value) => {
//     const newBuses = [...buses];
//     newBuses[index] = { ...newBuses[index], [field]: value };
//     setBuses(newBuses);
//   };

//   const updateAgent = (busIndex, agentIndex, field, value) => {
//     const newBuses = [...buses];
//     const agent = { ...newBuses[busIndex].agents[agentIndex], [field]: value };
    
//     if (field === 'amount' || field === 'percentage') {
//       const amount = parseFloat(agent.amount) || 0;
//       const percentage = parseFloat(agent.percentage) || 0;
//       agent.commission = percentage ? (amount * percentage / 100).toFixed(2) : '';
//       agent.total = percentage ? (amount - parseFloat(agent.commission)).toFixed(2) : amount.toFixed(2);
//     }
    
//     newBuses[busIndex].agents[agentIndex] = agent;
//     setBuses(newBuses);
//   };

//   const updateHOOrOnline = (busIndex, type, field, value) => {
//     const newBuses = [...buses];
//     const newData = { ...newBuses[busIndex][type], [field]: value };
//     if (field === 'amount' || field === 'percentage') {
//       const amount = parseFloat(newData.amount) || 0;
//       const percentage = parseFloat(newData.percentage) || 0;
//       newData.commission = percentage ? (amount * percentage / 100).toFixed(2) : '';
//       newData.total = percentage ? (amount - parseFloat(newData.commission)).toFixed(2) : amount.toFixed(2);
//     }
//     newBuses[busIndex][type] = newData;
//     setBuses(newBuses);
//   };

//   const calculateTotals = (bus) => {
//     const totalSeats = [bus.ho, bus.online, ...bus.agents].reduce((sum, item) => sum + (parseInt(item.seat) || 0), 0);
//     const totalAmount = [bus.ho, bus.online, ...bus.agents].reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
//     const totalTotal = [bus.ho, bus.online, ...bus.agents].reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
//     return { totalSeats, totalAmount: totalAmount.toFixed(2), totalTotal: totalTotal.toFixed(2) };
//   };

//   const calculateAllBusesTotal = () => {
//     return buses.reduce((sum, bus) => sum + parseFloat(calculateTotals(bus).totalTotal), 0).toFixed(2);
//   };

//   const renderBusWiseTab = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {buses.map((bus, busIndex) => (
//         <div key={busIndex} className="bg-white rounded-lg shadow-md p-6 space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="text"
//               placeholder="Vehicle Number"
//               value={bus.vehicleNumber}
//               onChange={(e) => updateBus(busIndex, 'vehicleNumber', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               placeholder="Route"
//               value={bus.route}
//               onChange={(e) => updateBus(busIndex, 'route', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="text"
//               placeholder="Driver Name"
//               value={bus.driverName}
//               onChange={(e) => updateBus(busIndex, 'driverName', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               placeholder="Pickup Man"
//               value={bus.pickupMan}
//               onChange={(e) => updateBus(busIndex, 'pickupMan', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="px-2 py-2 text-left">Agent</th>
//                   <th className="px-2 py-2 text-left">Seat</th>
//                   <th className="px-2 py-2 text-left">Amount</th>
//                   <th className="px-2 py-2 text-left">%</th>
//                   <th className="px-2 py-2 text-left">Comm.</th>
//                   <th className="px-2 py-2 text-left">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td className="px-2 py-2">HO</td>
//                   <td className="px-2 py-2"><input type="text" value={bus.ho.seat} onChange={(e) => updateHOOrOnline(busIndex, 'ho', 'seat', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
//                   <td className="px-2 py-2"><input type="text" value={bus.ho.amount} onChange={(e) => updateHOOrOnline(busIndex, 'ho', 'amount', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
//                   <td className="px-2 py-2"><input type="text" value={bus.ho.percentage} onChange={(e) => updateHOOrOnline(busIndex, 'ho', 'percentage', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
//                   <td className="px-2 py-2">{bus.ho.commission}</td>
//                   <td className="px-2 py-2">{bus.ho.total}</td>
//                 </tr>
//                 <tr>
//                   <td className="px-2 py-2">Online</td>
//                   <td className="px-2 py-2"><input type="text" value={bus.online.seat} onChange={(e) => updateHOOrOnline(busIndex, 'online', 'seat', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
//                   <td className="px-2 py-2"><input type="text" value={bus.online.amount} onChange={(e) => updateHOOrOnline(busIndex, 'online', 'amount', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
//                   <td className="px-2 py-2"><input type="text" value={bus.online.percentage} onChange={(e) => updateHOOrOnline(busIndex, 'online', 'percentage', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
//                   <td className="px-2 py-2">{bus.online.commission}</td>
//                   <td className="px-2 py-2">{bus.online.total}</td>
//                 </tr>
//                 {bus.agents.map((agent, agentIndex) => (
//                   <tr key={agentIndex}>
//                     <td className="px-2 py-2"><input type="text" value={agent.name} onChange={(e) => updateAgent(busIndex, agentIndex, 'name', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
//                     <td className="px-2 py-2"><input type="text" value={agent.seat} onChange={(e) => updateAgent(busIndex, agentIndex, 'seat', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
//                     <td className="px-2 py-2"><input type="text" value={agent.amount} onChange={(e) => updateAgent(busIndex, agentIndex, 'amount', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
//                     <td className="px-2 py-2"><input type="text" value={agent.percentage} onChange={(e) => updateAgent(busIndex, agentIndex, 'percentage', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
//                     <td className="px-2 py-2">{agent.commission}</td>
//                     <td className="px-2 py-2">{agent.total}</td>
//                   </tr>
//                 ))}
//                 <tr className="bg-gray-100 font-semibold">
//                   <td className="px-2 py-2">Total</td>
//                   <td className="px-2 py-2">{calculateTotals(bus).totalSeats}</td>
//                   <td className="px-2 py-2">{calculateTotals(bus).totalAmount}</td>
//                   <td className="px-2 py-2"></td>
//                   <td className="px-2 py-2"></td>
//                   <td className="px-2 py-2">{calculateTotals(bus).totalTotal}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="text"
//               placeholder="Advance/Report"
//               value={bus.advanceReport}
//               onChange={(e) => updateBus(busIndex, 'advanceReport', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               placeholder="Custom Box"
//               value={bus.customBox}
//               onChange={(e) => updateBus(busIndex, 'customBox', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   const renderAgentWiseTab = () => {
//     const allAgents = buses.flatMap(bus => 
//       [bus.ho, bus.online, ...bus.agents]
//         .filter(agent => agent.name)
//         .map(agent => ({ ...agent, vehicleNumber: bus.vehicleNumber }))
//     );

//     const uniqueAgents = Array.from(new Set(allAgents.map(a => a.name)));

//     return (
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="px-4 py-2 text-left">Agent Name</th>
//               {buses.map((bus, index) => (
//                 <th key={index} className="px-4 py-2 text-left">{bus.vehicleNumber || `Vehicle ${index + 1}`}</th>
//               ))}
//               <th className="px-4 py-2 text-left">Total (₹)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {uniqueAgents.map(agentName => {
//               const agentData =   allAgents.filter(a => a.name === agentName);
//               const totalAmount = agentData.reduce((sum, a) => sum + (parseFloat(a.total) || 0), 0);
//               return (
//                 <tr key={agentName}>
//                   <td className="px-4 py-2">{agentName}</td>
//                   {buses.map((bus, index) => {
//                     const data = agentData.find(a => a.vehicleNumber === bus.vehicleNumber);
//                     return <td key={index} className="px-4 py-2">{data ? data.total : ''}</td>;
//                   })}
//                   <td className="px-4 py-2">{totalAmount.toFixed(2)}</td>
//                 </tr>
//               );
//             })}
//             <tr className="bg-gray-100 font-semibold">
//               <td className="px-4 py-2">Total</td>
//               {buses.map((bus, index) => (
//                 <td key={index} className="px-4 py-2">{calculateTotals(bus).totalTotal}</td>
//               ))}
//               <td className="px-4 py-2">{calculateAllBusesTotal()}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const generateBusWisePDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text('Akanksha Tourism', 105, 15, { align: 'center' });
//     doc.setFontSize(12);
//     doc.text(`Date: ${date}`, 195, 15, { align: 'right' });
//     const startY = 25;
//     const boxWidth = 60;
//     const boxHeight = 80;
//     const margin = 5;
//     const columns = 3;
//     const rows = 3;
//     buses.forEach((bus, index) => {
//       const col = index % columns;
//       const row = Math.floor(index / columns);
//       const x = margin + col * (boxWidth + margin);
//       const y = startY + row * (boxHeight + margin);
//       doc.rect(x, y, boxWidth, boxHeight);
//       doc.setFontSize(8);
//       doc.text(`Vehicle: ${bus.vehicleNumber}`, x + 2, y + 5);
//       doc.text(`Driver: ${bus.driverName}`, x + 2, y + 10);
//       doc.text(`Pickup: ${bus.pickupMan}`, x + 2, y + 15);
//       const tableData = [
//         ['Agent', 'Seat', 'Amount', '%', 'Comm.', 'Total'],
//         ['HO', bus.ho.seat, bus.ho.amount, bus.ho.percentage, bus.ho.commission, bus.ho.total],
//         ['Online', bus.online.seat, bus.online.amount, bus.online.percentage, bus.online.commission, bus.online.total],
//         ...bus.agents.map(agent => [agent.name, agent.seat, agent.amount, agent.percentage, agent.commission, agent.total])
//       ];
//       doc.autoTable({
//         startY: y + 20,
//         head: [tableData[0]],
//         body: tableData.slice(1),
//         theme: 'grid',
//         styles: { fontSize: 6, cellPadding: 1 },
//         columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 8 }, 2: { cellWidth: 10 }, 3: { cellWidth: 8 }, 4: { cellWidth: 10 }, 5: { cellWidth: 10 } },
//         margin: { left: x + 2, right: x + boxWidth - 2 },
//       });
//       const totals = calculateTotals(bus);
//       doc.text(`Total Seats: ${totals.totalSeats}`, x + 2, y + 75);
//       doc.text(`Total Amount: ${totals.totalAmount}`, x + 2, y + 78);
//     });
//     doc.text(`All Buses Total: ${calculateAllBusesTotal()}`, 105, 280, { align: 'center' });
//     doc.save('bus_wise_report.pdf');
//   };

//   const generateAgentWisePDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text('Akanksha Tourism - Agent Wise Report', 105, 15, { align: 'center' });
//     doc.setFontSize(12);
//     doc.text(`Date: ${date}`, 195, 15, { align: 'right' });

//     const allAgents = buses.flatMap(bus => 
//       [bus.ho, bus.online, ...bus.agents]
//         .filter(agent => agent.name)
//         .map(agent => ({ ...agent, vehicleNumber: bus.vehicleNumber }))
//     );

//     const uniqueAgents = Array.from(new Set(allAgents.map(a => a.name)));

//     const tableData = [
//       ['Agent Name', ...buses.map(bus => bus.vehicleNumber || 'Vehicle'), 'Total (₹)'],
//       ...uniqueAgents.map(agentName => {
//         const agentData = allAgents.filter(a => a.name === agentName);
//         const totalAmount = agentData.reduce((sum, a) => sum + (parseFloat(a.total) || 0), 0);
//         return [
//           agentName,
//           ...buses.map(bus => {
//             const data = agentData.find(a => a.vehicleNumber === bus.vehicleNumber);
//             return data ? data.total : '';
//           }),
//           totalAmount.toFixed(2)
//         ];
//       }),
//       [
//         'Total',
//         ...buses.map(bus => calculateTotals(bus).totalTotal),
//         calculateAllBusesTotal()
//       ]
//     ];

//     doc.autoTable({
//       startY: 25,
//       head: [tableData[0]],
//       body: tableData.slice(1),
//       theme: 'grid',
//       styles: { fontSize: 8, cellPadding: 2 },
//       headStyles: { fillColor: [200, 200, 200] },
//       alternateRowStyles: { fillColor: [240, 240, 240] },
//     });

//     doc.save('agent_wise_report.pdf');
//   };

//   const generatePDF = () => {
//     if (activeTab === 'bus-wise') {
//       generateBusWisePDF();
//     } else {
//       generateAgentWisePDF();
//     }
//   };

//   return (
//     <div className="w-full bg-white text-gray-900 px-4 py-8">
//       <h1 className="text-3xl font-bold text-center mb-8">Akanksha Tourism</h1>
//       <div className="flex flex-col md:flex-row justify-between items-center mb-8">
//         <input
//           type="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           className="mb-4 md:mb-0 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <div className="flex space-x-4">
//           <button onClick={saveData} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Save Data</button>
//           <button onClick={generatePDF} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">Generate PDF</button>
//           <button onClick={eraseData} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">Erase Data</button>
//         </div>
//       </div>
//       <div className="mb-8">
//         <div className="flex border-b border-gray-200">
//           <button
//             className={`px-4 py-2 font-medium ${activeTab === 'bus-wise' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
//             onClick={() => setActiveTab('bus-wise')}
//           >
//             Bus Wise
//           </button>
//           <button
//             className={`px-4 py-2 font-medium ${activeTab === 'agent-wise' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
//             onClick={() => setActiveTab('agent-wise')}
//           >
//             Agent Wise
//           </button>
//         </div>
//       </div>
//       <div className="mb-8">
//         {activeTab === 'bus-wise' ? renderBusWiseTab() : renderAgentWiseTab()}
//       </div>
//       <div className="text-center">
//         <h2 className="text-2xl font-semibold mb-2">All Buses Total</h2>
//         <p className="text-3xl font-bold text-blue-600">{calculateAllBusesTotal()}</p>
//       </div>
//     </div>
//   );
// }

'use client'

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const initialAgent = { name: '', seat: '', amount: '', percentage: '', commission: '', total: '' };
const initialBusData = {
  vehicleNumber: '',
  route: '',
  driverName: '',
  pickupMan: '',
  agents: Array(7).fill(null).map(() => ({...initialAgent})),
  ho: { ...initialAgent, name: 'HO' },
  online: { ...initialAgent, name: 'Online' },
  advanceReport: '',
  customBox: '',
};

const initialReportData = {
  receipt: Array(30).fill({ amount: '', particulars: '' }),
  payment: Array(30).fill({ amount: '', description: '' }),
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('bus-wise');
  const [buses, setBuses] = useState(Array(9).fill(null).map(() => JSON.parse(JSON.stringify(initialBusData))));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState(initialReportData);

  useEffect(() => {
    const savedData = localStorage.getItem('busData');
    if (savedData) {
      setBuses(JSON.parse(savedData));
    }
    const savedReportData = localStorage.getItem('reportData');
    if (savedReportData) {
      setReportData(JSON.parse(savedReportData));
    }
  }, []);

  const saveData = () => {
    localStorage.setItem('busData', JSON.stringify(buses));
    localStorage.setItem('reportData', JSON.stringify(reportData));
    alert('Data saved successfully!');
  };

  const eraseData = () => {
    if (window.confirm('Are you sure you want to erase all data?')) {
      localStorage.removeItem('busData');
      localStorage.removeItem('reportData');
      setBuses(Array(9).fill(null).map(() => JSON.parse(JSON.stringify(initialBusData))));
      setReportData(initialReportData);
    }
  };

  const updateBus = (index, field, value) => {
    const newBuses = [...buses];
    newBuses[index] = { ...newBuses[index], [field]: value };
    setBuses(newBuses);
  };

  const updateAgent = (busIndex, agentIndex, field, value) => {
    const newBuses = [...buses];
    const agent = { ...newBuses[busIndex].agents[agentIndex], [field]: value };
    
    if (field === 'amount' || field === 'percentage') {
      const amount = parseFloat(agent.amount) || 0;
      const percentage = parseFloat(agent.percentage) || 0;
      agent.commission = percentage ? (amount * percentage / 100).toFixed(2) : '';
      agent.total = percentage ? (amount - parseFloat(agent.commission)).toFixed(2) : amount.toFixed(2);
    }
    
    newBuses[busIndex].agents[agentIndex] = agent;
    setBuses(newBuses);
  };

  const updateHOOrOnline = (busIndex, type, field, value) => {
    const newBuses = [...buses];
    const newData = { ...newBuses[busIndex][type], [field]: value };
    if (field === 'amount' || field === 'percentage') {
      const amount = parseFloat(newData.amount) || 0;
      const percentage = parseFloat(newData.percentage) || 0;
      newData.commission = percentage ? (amount * percentage / 100).toFixed(2) : '';
      newData.total = percentage ? (amount - parseFloat(newData.commission)).toFixed(2) : amount.toFixed(2);
    }
    newBuses[busIndex][type] = newData;
    setBuses(newBuses);
  };

  const calculateTotals = (bus) => {
    const totalSeats = [bus.ho, bus.online, ...bus.agents].reduce((sum, item) => sum + (parseInt(item.seat) || 0), 0);
    const totalAmount = [bus.ho, bus.online, ...bus.agents].reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalTotal = [bus.ho, bus.online, ...bus.agents].reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    return { totalSeats, totalAmount: totalAmount.toFixed(2), totalTotal: totalTotal.toFixed(2) };
  };

  const calculateAllBusesTotal = () => {
    return buses.reduce((sum, bus) => sum + parseFloat(calculateTotals(bus).totalTotal), 0).toFixed(2);
  };

  const updateReportData = (type, index, field, value) => {
    const newReportData = { ...reportData };
    newReportData[type][index] = { ...newReportData[type][index], [field]: value };
    setReportData(newReportData);
  };

  const addReportRow = (type) => {
    const newReportData = { ...reportData };
    newReportData[type].push({ amount: '', [type === 'receipt' ? 'particulars' : 'description']: '' });
    setReportData(newReportData);
  };

  const calculateReportTotal = (type) => {
    return reportData[type].reduce((total, item) => total + (parseFloat(item.amount) || 0), 0).toFixed(2);
  };

  const renderBusWiseTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {buses.map((bus, busIndex) => (
        <div key={busIndex} className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Vehicle Number"
              value={bus.vehicleNumber}
              onChange={(e) => updateBus(busIndex, 'vehicleNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Route"
              value={bus.route}
              onChange={(e) => updateBus(busIndex, 'route', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Driver Name"
              value={bus.driverName}
              onChange={(e) => updateBus(busIndex, 'driverName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Pickup Man"
              value={bus.pickupMan}
              onChange={(e) => updateBus(busIndex, 'pickupMan', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 text-left">Agent</th>
                  <th className="px-2 py-2 text-left">Seat</th>
                  <th className="px-2 py-2 text-left">Amount</th>
                  <th className="px-2 py-2 text-left">%</th>
                  <th className="px-2 py-2 text-left">Comm.</th>
                  <th className="px-2 py-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-2">HO</td>
                  <td className="px-2 py-2"><input type="text" value={bus.ho.seat} onChange={(e) => updateHOOrOnline(busIndex, 'ho', 'seat', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                  <td className="px-2 py-2"><input type="text" value={bus.ho.amount} onChange={(e) => updateHOOrOnline(busIndex, 'ho', 'amount', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                  <td className="px-2 py-2"><input type="text" value={bus.ho.percentage} onChange={(e) => updateHOOrOnline(busIndex, 'ho', 'percentage', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                  <td className="px-2 py-2">{bus.ho.commission}</td>
                  <td className="px-2 py-2">{bus.ho.total}</td>
                </tr>
                <tr>
                  <td className="px-2 py-2">Online</td>
                  <td className="px-2 py-2"><input type="text" value={bus.online.seat} onChange={(e) => updateHOOrOnline(busIndex, 'online', 'seat', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                  <td className="px-2 py-2"><input type="text" value={bus.online.amount} onChange={(e) => updateHOOrOnline(busIndex, 'online', 'amount', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                  <td className="px-2 py-2"><input type="text" value={bus.online.percentage} onChange={(e) => updateHOOrOnline(busIndex, 'online', 'percentage', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                  <td className="px-2 py-2">{bus.online.commission}</td>
                  <td className="px-2 py-2">{bus.online.total}</td>
                </tr>
                {bus.agents.map((agent, agentIndex) => (
                  <tr key={agentIndex}>
                    <td className="px-2 py-2"><input type="text" value={agent.name} onChange={(e) => updateAgent(busIndex, agentIndex, 'name', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                    <td className="px-2 py-2"><input type="text" value={agent.seat} onChange={(e) => updateAgent(busIndex, agentIndex, 'seat', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                    <td className="px-2 py-2"><input type="text" value={agent.amount} onChange={(e) => updateAgent(busIndex, agentIndex, 'amount', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                    <td className="px-2 py-2"><input type="text" value={agent.percentage} onChange={(e) => updateAgent(busIndex, agentIndex, 'percentage', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></td>
                    <td className="px-2 py-2">{agent.commission}</td>
                    <td className="px-2 py-2">{agent.total}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td className="px-2 py-2">Total</td>
                  <td className="px-2 py-2">{calculateTotals(bus).totalSeats}</td>
                  <td className="px-2 py-2">{calculateTotals(bus).totalAmount}</td>
                  <td className="px-2 py-2"></td>
                  <td className="px-2 py-2"></td>
                  <td className="px-2 py-2">{calculateTotals(bus).totalTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Advance/Report"
              value={bus.advanceReport}
              onChange={(e) => updateBus(busIndex, 'advanceReport', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Custom Box"
              value={bus.customBox}
              onChange={(e) => updateBus(busIndex, 'customBox', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderAgentWiseTab = () => {
    const allAgents = buses.flatMap((bus, busIndex) => 
      [bus.ho, bus.online, ...bus.agents]
        .filter(agent => agent.name)
        .map(agent => ({ ...agent, busId: bus.vehicleNumber || `Bus ${busIndex + 1}` }))
    );

    const uniqueAgents = Array.from(new Set(allAgents.map(a => a.name)));

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Agent Name</th>
              {buses.map((bus, index) => (
                <th key={index} className="px-4 py-2 text-left">{bus.vehicleNumber || `Bus ${index + 1}`}</th>
              ))}
              <th className="px-4 py-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {uniqueAgents.map(agentName => {
              const agentData = allAgents.filter(a => a.name === agentName);
              const totalAmount = agentData.reduce((sum, a) => sum + (parseFloat(a.total) || 0), 0);
              return (
                <tr key={agentName}>
                  <td className="px-4 py-2">{agentName}</td>
                  {buses.map((bus, index) => {
                    const busId = bus.vehicleNumber || `Bus ${index + 1}`;
                    const data = agentData.find(a => a.busId === busId);
                    return <td key={index} className="px-4 py-2">{data ? data.total : ''}</td>;
                  })}
                  <td className="px-4 py-2">{totalAmount.toFixed(2)}</td>
                </tr>
              );
            })}
            <tr className="bg-gray-100 font-semibold">
              <td className="px-4 py-2">Total</td>
              {buses.map((bus, index) => (
                <td key={index} className="px-4 py-2">{calculateTotals(bus).totalTotal}</td>
              ))}
              <td className="px-4 py-2">{calculateAllBusesTotal()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const renderReportsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">RECEIPT</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Amount</th>
              <th className="text-left">Particulars</th>
            </tr>
          </thead>
          <tbody>
            {reportData.receipt.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateReportData('receipt', index, 'amount', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.particulars}
                    onChange={(e) => updateReportData('receipt', index, 'particulars', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <button onClick={() => addReportRow('receipt')} className="mt-2 p-2 bg-blue-500 text-white rounded">
                  Add Row
                </button>
              </td>
            </tr>
            <tr>
              <td className="font-bold">Total: {calculateReportTotal('receipt')}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">PAYMENT</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Amount</th>
              <th className="text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {reportData.payment.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateReportData('payment', index, 'amount', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateReportData('payment', index, 'description', e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <button onClick={() => addReportRow('payment')} className="mt-2 p-2 bg-blue-500 text-white rounded">
                  Add Row
                </button>
              </td>
            </tr>
            <tr>
              <td className="font-bold">Total: {calculateReportTotal('payment')}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );

  const generateBusWisePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Akanksha Tourism', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 195, 15, { align: 'right' });
    const startY = 25;
    const boxWidth = 60;
    const boxHeight = 80;
    const margin = 5;
    const columns = 3;
    const rows = 3;
    buses.forEach((bus, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = margin + col * (boxWidth + margin);
      const y = startY + row * (boxHeight + margin);
      doc.rect(x, y, boxWidth, boxHeight);
      doc.setFontSize(8);
      doc.text(`Vehicle: ${bus.vehicleNumber}`, x + 2, y + 5);
      doc.text(`Driver: ${bus.driverName}`, x + 2, y + 10);
      doc.text(`Pickup: ${bus.pickupMan}`, x + 2, y + 15);
      const tableData = [
        ['Agent', 'Seat', 'Amount', '%', 'Comm.', 'Total'],
        ['HO', bus.ho.seat, bus.ho.amount, bus.ho.percentage, bus.ho.commission, bus.ho.total],
        ['Online', bus.online.seat, bus.online.amount, bus.online.percentage, bus.online.commission, bus.online.total],
        ...bus.agents.map(agent => [agent.name, agent.seat, agent.amount, agent.percentage, agent.commission, agent.total])
      ];
      doc.autoTable({
        startY: y + 20,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'grid',
        styles: { fontSize: 6, cellPadding: 1 },
        columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 8 }, 2: { cellWidth: 10 }, 3: { cellWidth: 8 }, 4: { cellWidth: 10 }, 5: { cellWidth: 10 } },
        margin: { left: x + 2, right: x + boxWidth - 2 },
      });
      const totals = calculateTotals(bus);
      doc.text(`Total Seats: ${totals.totalSeats}`, x + 2, y + 75);
      doc.text(`Total Amount: ${totals.totalAmount}`, x + 2, y + 78);
    });
    doc.text(`All Buses Total: ${calculateAllBusesTotal()}`, 105, 280, { align: 'center' });
    doc.save('bus_wise_report.pdf');
  };

  const generateAgentWisePDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Akanksha Tourism - Agent Wise Report', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`Date: ${date}`, pageWidth - 10, 20, { align: 'right' });

    const allAgents = buses.flatMap((bus, busIndex) => 
      [bus.ho, bus.online, ...bus.agents]
        .filter(agent => agent.name)
        .map(agent => ({ ...agent, busId: bus.vehicleNumber || `Bus ${busIndex + 1}` }))
    );

    const uniqueAgents = Array.from(new Set(allAgents.map(a => a.name)));

    const tableData = [
      ['Agent Name', ...buses.map((bus, index) => bus.vehicleNumber || `Bus ${index + 1}`), 'Total'],
      ...uniqueAgents.map(agentName => {
        const agentData = allAgents.filter(a => a.name === agentName);
        const totalAmount = agentData.reduce((sum, a) => sum + (parseFloat(a.total) || 0), 0);
        return [
          agentName,
          ...buses.map((bus, index) => {
            const busId = bus.vehicleNumber || `Bus ${index + 1}`;
            const data = agentData.find(a => a.busId === busId);
            return data ? data.total : '';
          }),
          totalAmount.toFixed(2)
        ];
      }),
      [
        'Total',
        ...buses.map(bus => calculateTotals(bus).totalTotal),
        calculateAllBusesTotal()
      ]
    ];

    doc.autoTable({
      startY: 30,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [200, 200, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        [tableData[0].length - 1]: { cellWidth: 30, fontStyle: 'bold' }
      },
      didParseCell: (data) => {
        if (data.row.index === tableData.length - 2) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = [0, 0, 100];
        }
      }
    });

    doc.save('agent_wise_report.pdf');
  };

  const generateReportsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Akanksha Tourism', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 195, 15, { align: 'right' });

    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const columnWidth = (pageWidth - 2 * margin) / 2;

    // RECEIPT Table
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(255, 165, 0); // Orange color
    doc.rect(margin, 25, columnWidth, 8, 'F');
    doc.text('RECEIPT', margin + 2, 31);

    doc.autoTable({
      startY: 33,
      head: [['Amount', 'Particulars']],
      body: reportData.receipt.map(item => [item.amount, item.particulars]),
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: columnWidth * 0.3 },
        1: { cellWidth: columnWidth * 0.7 }
      },
      margin: { left: margin },
      tableWidth: columnWidth,
    });

    // PAYMENT Table
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(255, 165, 0); // Orange color
    doc.rect(margin + columnWidth, 25, columnWidth, 8, 'F');
    doc.text('PAYMENT', margin + columnWidth + 2, 31);

    doc.autoTable({
      startY: 33,
      head: [['Amount', 'Description']],
      body: reportData.payment.map(item => [item.amount, item.description]),
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
      columnStyles: {
        0: { cellWidth: columnWidth * 0.3 },
        1: { cellWidth: columnWidth * 0.7 }
      },
      margin: { left: margin + columnWidth },
      tableWidth: columnWidth,
    });

    // Add totals at the bottom of each table
    const receiptTotal = calculateReportTotal('receipt');
    const paymentTotal = calculateReportTotal('payment');

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total: ${receiptTotal}`, margin, doc.autoTable.previous.finalY + 10);
    doc.text(`Total: ${paymentTotal}`, margin + columnWidth, doc.autoTable.previous.finalY + 10);

    doc.save('financial_report.pdf');
  };

  const generatePDF = () => {
    if (activeTab === 'bus-wise') {
      generateBusWisePDF();
    } else if (activeTab === 'agent-wise') {
      generateAgentWisePDF();
    } else {
      generateReportsPDF();
    }
  };

  return (
    <div className="w-full bg-white text-gray-900 px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Akanksha Tourism</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mb-4 md:mb-0 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-4">
          <button onClick={saveData} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Save Data</button>
          <button onClick={generatePDF} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">Generate PDF</button>
          <button onClick={eraseData} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">Erase Data</button>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'bus-wise' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('bus-wise')}
          >
            Bus Wise
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'agent-wise' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('agent-wise')}
          >
            Agent Wise
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'reports' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>
      </div>
      <div className="mb-8">
        {activeTab === 'bus-wise' && renderBusWiseTab()}
        {activeTab === 'agent-wise' && renderAgentWiseTab()}
        {activeTab === 'reports' && renderReportsTab()}
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">All Buses Total</h2>
        <p className="text-3xl font-bold text-blue-600">{calculateAllBusesTotal()}</p>
      </div>
    </div>
  );
}


