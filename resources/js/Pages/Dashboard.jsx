import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axiosInstance from '../Pages/Auth/axiosConfig';

export default function Dashboard({ auth }) {
    const { user } = auth;
    // const { authenticatedUser } = usePage().props;

    console.log({ auth });

    const [roleName, setRoleName] = useState('');

    useEffect(() => {
        const getRole = () => {
            axiosInstance
                .get(`/api/roles/${user.role_id}`)
                .then((response) => {
                    console.log('response ==>', response.data);
                    setRoleName(response.data.name);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            axiosInstance
                .get('/api/roles')
                .then((response) => {
                    console.log('rolessss', response.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };

        const dashboardReports = () => {
            axiosInstance
                .get(`/api/dashboard-reports`)
                .then((response) => {
                    console.log('DASHBOARD_REPORTS ==>', response.data);
                    // setRoleName(response.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };
        dashboardReports();
        if (user.role_id) {
            // Only fetch if role_id exists
            getRole();
        }
    }, [user]);

    // const handleClick = () => {
    //     axiosInstance
    //         .get('/assign-roles')
    //         .then((response) => {
    //             console.log('ASSIGN_ROLES');
    //             console.log('response ==>', response.data);
    //             console.log('role assigned', response.data);
    //         })
    //         .catch((error) => {
    //             if (error.response && error.response.status === 403) {
    //                 alert(
    //                     'You do not have permission to access this resource.',
    //                 );
    //             } else {
    //                 console.error('An error occurred:', error);
    //             }
    //         });
    // };

    const handleClickOnTaskCreation = () => {
        axiosInstance
            .get('/task-form')
            .then((response) => {
                // console.log('response ==>', response.data);
                console.log('task-form page', response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                </div>
            }
        >
            {/* <Head title="Dashboard" /> */}

            <div className="intro py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
