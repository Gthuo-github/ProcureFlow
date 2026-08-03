import { redirect } from 'next/navigation';

export default function LegacyOrderEditPage() {
  redirect('/dashboard/orders');
}
