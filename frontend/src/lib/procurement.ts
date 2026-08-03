export type RequisitionStatus = 'draft' | 'pending approval' | 'approved' | 'sourcing' | 'purchase order issued';

export interface Requisition {
  id: string;
  title: string;
  category: string;
  amount: number;
  requester: string;
  submittedAt: string;
  status: RequisitionStatus;
  items: number;
}

export const procurementSummary = {
  spendUnderManagement: 2845000,
  pendingApprovals: 6,
  activeSourcingEvents: 3,
  invoiceExceptions: 2,
};

export const initialRequisitions: Requisition[] = [
  { id: 'REQ-1048', title: 'Q3 office equipment', category: 'IT & equipment', amount: 486000, requester: 'Amina Hassan', submittedAt: 'Today', status: 'pending approval', items: 8 },
  { id: 'REQ-1047', title: 'Facilities maintenance supplies', category: 'Facilities', amount: 128500, requester: 'Brian Otieno', submittedAt: 'Yesterday', status: 'sourcing', items: 14 },
  { id: 'REQ-1042', title: 'Sales team travel', category: 'Travel', amount: 312000, requester: 'Grace Wanjiku', submittedAt: '24 Jun 2026', status: 'approved', items: 5 },
  { id: 'REQ-1039', title: 'Cloud services renewal', category: 'Software', amount: 765000, requester: 'Peter Mwangi', submittedAt: '21 Jun 2026', status: 'purchase order issued', items: 1 },
];

export const pendingApprovals = [
  { id: 'REQ-1048', title: 'Q3 office equipment', requester: 'Amina Hassan', department: 'Operations', amount: 486000, submittedAt: 'Today, 09:42', policy: 'Manager approval' },
  { id: 'REQ-1045', title: 'Customer event venue', requester: 'Daniel Kiptoo', department: 'Marketing', amount: 175000, submittedAt: 'Yesterday, 15:20', policy: 'Budget owner approval' },
  { id: 'INV-228', title: 'Invoice — Metro Office Supplies', requester: 'Finance team', department: 'Accounts payable', amount: 98400, submittedAt: '24 Jun 2026', policy: '3-way match exception' },
];

export const sourcingEvents = [
  { id: 'RFQ-208', title: 'Facilities maintenance supplies', suppliers: 4, responses: 3, closes: 'Closes in 2 days' },
  { id: 'RFQ-207', title: 'Security services renewal', suppliers: 5, responses: 2, closes: 'Closes in 4 days' },
  { id: 'RFQ-205', title: 'Laptop fleet refresh', suppliers: 3, responses: 3, closes: 'Ready to award' },
];

export function formatKES(value: number) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency', currency: 'KES', maximumFractionDigits: 0,
  }).format(value).replace('KES', 'KSh');
}
