import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import axiosInstance from './Auth/axiosConfig';

const TaskForm = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const getDepartments = () => {
            axiosInstance
                .get('/api/department')
                .then((response) => {
                    setDepartments(response.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };
        getDepartments();
    }, []);

    // const departmentIds = departments?.map((dept) => dept.id);

    const formik = useFormik({
        initialValues: {
            date: '',
            department_id: '',
            task_details: '',
            hours_worked: '',
        },
        validationSchema: Yup.object({
            date: Yup.date()
                .required('Date is required')
                .max(new Date(), 'Date cannot be in the future'),
            department_id: Yup.number().required('dnvjndjvknkj'),
            // .oneOf(departmentIds, 'Invalid department_id selected'),
            task_details: Yup.string()
                .required('Task details are required')
                .min(10, 'Task details must be at least 10 characters'),
            hours_worked: Yup.number()
                .required('Hours worked is required')
                .positive('Hours worked must be positive')
                .max(24, 'Hours worked cannot exceed 24'),
        }),
        onSubmit: async (values) => {
            values = { ...values, department_id: Number(values.department_id) };
            try {
                await axiosInstance.post(`/api/task-submission`, values);
                alert('Data successfully submitted');
                formik.resetForm();
                // await axiosInstance.get(`/task-form`).then((response) => {
                //     console.log({ response });
                // });
                console.log('Form submitted with values:', values);
            } catch (error) {
                console.error('Submission error:', error.message);
            }
        },
    });

    // const handleSave = async (userId, roleId) => {
    //     console.log({ userId, roleId });
    //     try {
    //         await Inertia.put(`/api/user/${userId}`, {
    //             role_id: roleId,
    //         });
    //         fetchUsersAndRoles(); // Refresh the user list
    //     } catch (error) {
    //         console.error('Error updating role:', error);
    //     }
    // };
    const onSubmit = async (e) => {
        e.preventDefault();
        formik.handleSubmit();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Task Form
                    </h2>
                </div>
            }
        >
            <form
                onSubmit={onSubmit}
                className="mx-auto mt-8 max-w-md rounded bg-white p-6 shadow-md"
            >
                <div className="mb-4">
                    <label
                        htmlFor="date"
                        className="mb-2 block text-sm font-bold text-gray-700"
                    >
                        Date:
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        max={new Date().toISOString().split('T')[0]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.date}
                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    />
                    {formik.touched.date && formik.errors.date ? (
                        <div className="text-xs italic text-red-500">
                            {formik.errors.date}
                        </div>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="department_id"
                        className="mb-2 block text-sm font-bold text-gray-700"
                    >
                        Department:
                    </label>
                    <select
                        type="number"
                        id="department_id"
                        name="department_id"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.department_id}
                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    >
                        <option value="">Select a department</option>
                        {departments?.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                    {formik.touched.department_id &&
                    formik.errors.department_id ? (
                        <div className="text-xs italic text-red-500">
                            {formik.errors.department_id}
                        </div>
                    ) : null}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="task_details"
                        className="mb-2 block text-sm font-bold text-gray-700"
                    >
                        Task Details:
                    </label>
                    <textarea
                        id="task_details"
                        name="task_details"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.task_details}
                        className="focus:shadow-outline h-32 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    />
                    {formik.touched.task_details &&
                    formik.errors.task_details ? (
                        <div className="text-xs italic text-red-500">
                            {formik.errors.task_details}
                        </div>
                    ) : null}
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="hours_worked"
                        className="mb-2 block text-sm font-bold text-gray-700"
                    >
                        Hours Worked:
                    </label>
                    <input
                        type="number"
                        id="hours_worked"
                        name="hours_worked"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.hours_worked}
                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    />
                    {formik.touched.hours_worked &&
                    formik.errors.hours_worked ? (
                        <div className="text-xs italic text-red-500">
                            {formik.errors.hours_worked}
                        </div>
                    ) : null}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default TaskForm;
