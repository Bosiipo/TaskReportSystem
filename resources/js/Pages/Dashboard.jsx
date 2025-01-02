import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Pages/Auth/axiosConfig';

export default function Dashboard({ auth }) {
    const { user } = auth;
    // const { authenticatedUser } = usePage().props;

    console.log({ auth });

    const [roleName, setRoleName] = useState('');
    const navigate = useNavigate();

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
        if (user.role_id) {
            // Only fetch if role_id exists
            getRole();
        }
    }, [user]);

    const handleClick = () => {
        console.log('Button Clicked!');
        axiosInstance
            .get('/assign-roles')
            .then((response) => {
                console.log('response ==>', response.data);
                console.log('role assigned', response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        navigate('/assign-roles');
    };

    const handleClickOnTaskCreation = () => {
        // axiosInstance
        //     .get('/task-form')
        //     .then((response) => {
        //         console.log('response ==>', response.data);
        //         console.log('role assigned', response.data);
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //     });
        navigate('/task-form');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                    {/* {roleName === 'Admin' ? ( */}
                        <button
                            className="rounded bg-green-800 p-1 px-3"
                            onClick={handleClick}
                        >
                            Assign Roles
                        </button>
                    {/* ) : ( */}
                        <button
                            className="rounded bg-green-800 p-1 px-3"
                            onClick={handleClickOnTaskCreation}
                        >
                            Record Task Report
                        </button>
                    {/* )} */}
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
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
