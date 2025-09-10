import { AdminTabProvider } from '@/context/AdminTabContext';

export default function AdminLayout({ children }) {
    return <AdminTabProvider>{children}</AdminTabProvider>;
}
