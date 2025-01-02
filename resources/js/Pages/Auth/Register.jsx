import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import Select from '@/Components/Select';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';


export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '1',
    });
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        axios
            .get('http://127.0.0.1:8000/api/roles')
            .then((response) => {
                console.log('response ==>', response.data);
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    }, []);

    const initializeCsrf = async () => {
        await axios.get('/sanctum/csrf-cookie'); // Fetch CSRF token
    };

    const submit = async (e) => {
        e.preventDefault();

        console.log('Enter Submit!');

        try {
            await initializeCsrf(); // Fetch CSRF token
            post('/register', data, {
                onSuccess: () => {
                    console.log('User registered successfully');
                },
                onError: (errors) => {
                    console.error('Registration failed:', errors);
                },
            });
            // axios
            // .post('http://127.0.0.1:8000/api/register', data)
            // .then((response) => {
            //     console.log('response on register ==>', response.data);
            //         navigate('/dashboard');
            // })
            // .catch((error) => {
            //     console.error('Error:', error);
            // });
            alert('Registration successful!');
        } catch (error) {
            console.error(error);
            alert('Registration failed!');
        }
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* <div className="mt-4">
                    <InputLabel htmlFor="role_id" value="Select Role" />

                    <Select
                        id="role_id"
                        name="role_id"
                        value={data.role_id}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('role_id', e.target.value)}
                        required
                    />

                    <InputError message={errors.role_id} className="mt-2" />
                </div> */}

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
