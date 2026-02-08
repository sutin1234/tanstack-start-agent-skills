/**
 * Users Route
 * 
 * Following TanStack Router best practices:
 * - Route Organization (org-file-based-routing)
 * - Data Loading with TanStack Query (load-ensure-query-data)
 * - Proper meta tags for SEO
 */
import { UserList } from "../components/user-feed";
import type { Route } from "./+types/users";

/**
 * Meta function for SEO
 */
export function meta({ }: Route.MetaArgs) {
    return [
        { title: "User Directory | My React Router App" },
        {
            name: "description",
            content: "Browse our user directory featuring a list of users with their contact information and company details."
        },
    ];
}

/**
 * Users page component
 */
export default function Users() {
    return <UserList />;
}
