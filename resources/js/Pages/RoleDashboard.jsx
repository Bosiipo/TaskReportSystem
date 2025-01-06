import { Inertia } from '@inertiajs/inertia';
import { useEffect, useState } from 'react';
import axiosInstance from '../Pages/Auth/axiosConfig';

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

    const fetchUsersAndRoles = async () => {
        try {
            const usersResponse = await axiosInstance.get(
                '/api/users-with-roles',
            );
            await axiosInstance
                .get('/api/roles')
                .then((response) => {
                    console.log('roles ==>', response.data);
                    setRoles(response.data);
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
        <div className="admin-users px-10">
            <h1 className="py-6 text-center text-4xl font-semibold">Manage Users</h1>
            <table className="table w-full caption-bottom border-collapse text-nowrap border-[#D7E8F4] align-middle text-sm/5">
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
                    {users.map((user) => (
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
        </div>
    );
}
