import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import { useEffect, useState } from 'react';
import axiosInstance from '../Pages/Auth/axiosConfig';
import { Link } from '@inertiajs/react';

export default function RoleDashboard({ auth }) {
    console.log({ auth });
    // const { user } = auth;
    const [users, setUsers] = useState([{}]);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState({});

    // Fetch users and roles when the component mounts
    useEffect(() => {
        // setEditingUserId(user.id);
        fetchUsersAndRoles();
        console.log('ROLE DASHBOARD!');
        // const initialRoles = users.reduce((acc, user) => {
        //     acc[user.id] = user.role_id; // Assuming 'role_id' is the property for the user's current role
        //     return acc;
        // }, {});
        // setSelectedRoles(initialRoles);
    }, []);

    const handleRoleChange = (userId, roleId) => {
        console.log({ roleId });
        setSelectedRoles((prev) => ({
            ...prev,
            [userId]: roleId,
        }));
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            fetchRoles(page);
        }
    };

    const fetchUsersAndRoles = async (page = 1, perPage = 5) => {
        try {
            const usersResponse = await axiosInstance.get(
                `/api/users-with-roles?page=${page}&per_page=${perPage}`,
            );
            await axiosInstance
                .get('/api/roles')
                .then((response) => {
                    console.log('roles ==>', response.data);
                    setRoles(response.data.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            console.log('USERS RESPONSE ==>', usersResponse.data);
            setUsers(usersResponse.data);
            // console.log({ retro: rolesResponse });
            // setRoles(rolesResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSave = async (userId, roleId) => {
        console.log({ userId, roleId });
        try {
            await Inertia.put(`/api/user/${userId}`, {
                role_id: roleId,
            });
            fetchUsersAndRoles(); // Refresh the user list
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Manage Users
                    </h2>
                </div>
            }
        >
            <table className="tabloid table w-full caption-bottom border-collapse text-nowrap border-[#D7E8F4] align-middle text-sm/5">
                <thead className="align-bottom">
                    <tr>
                        <th className="p-3 py-4 first:pl-0 [&:not(:first-child)]:hidden">
                            Name
                        </th>
                        <th className="p-3 py-4 first:pl-0 [&:not(:first-child)]:md:table-cell">
                            Email
                        </th>
                        <th className="p-3 py-4 first:pl-0 [&:not(:first-child)]:md:table-cell">
                            Role
                        </th>
                        <th className="p-3 py-4 first:pl-0 [&:not(:first-child)]:md:table-cell">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users?.data?.map((user) => (
                        <tr key={user.id}>
                            <td className="text-center first:pb-3 first:pl-0 first:pt-2 first:md:py-2">
                                {user.name}
                            </td>
                            <td className="text-center first:pb-3 first:pl-0 first:pt-2 first:md:py-2">
                                {user.email}
                            </td>
                            <td className="text-center first:pb-3 first:pl-0 first:pt-2 first:md:py-2">
                                {user.role_name ? user.role_name : '-'}{' '}
                            </td>
                            <td className="text-center first:pb-3 first:pl-0 first:pt-2 first:md:py-2 [&:not(:first-child)]:hidden [&:not(:first-child)]:py-4 [&:not(:first-child)]:md:table-cell">
                                <select
                                    value={user.role_id}
                                    onChange={(e) => {
                                        console.log('e ==>', e.target.value);
                                        console.log('userId ==>', user.id);
                                        handleRoleChange(
                                            user.id,
                                            e.target.value,
                                        );
                                        console.log(
                                            'selectedRoles ==>',
                                            selectedRoles,
                                        );
                                    }}
                                >
                                    <option value="">Select Role</option>
                                    {roles?.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="ml-2 rounded bg-green-800 p-1 px-3"
                                    onClick={() =>
                                        handleSave(
                                            user.id,
                                            selectedRoles[user.id],
                                        )
                                    }
                                >
                                    Save
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="paginator mt-3 px-4 py-12">
                {users?.links?.map((link) => (
                    <Link
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        key={link.label}
                        className={`mx-1 p-1 ${link.active ? 'font-bold text-blue-500' : ''}`}
                    />
                ))}
            </div>
        </AuthenticatedLayout>
    );
}

// link.url ? (
//     <Link
//         key={link.label}
//         href={link.url}
        // className={`mx-1 p-1 ${link.active ? 'font-bold text-blue-500' : ''}`}
        // dangerouslySetInnerHTML={{ __html: link.label }}
//     />
// ) : (
//     <span
//         key={link.label}
//         className="mx-1 p-1 text-slate-300"
//         dangerouslySetInnerHTML={{ __html: link.label }}
//     ></span>
// ),
// )
// }
