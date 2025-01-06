import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import axiosInstance from './Auth/axiosConfig';

// interface SubmittedForm {
//   id: string;
//   employeeName: string;
//   date: string;
//   department: string;
//   taskDetails: string;
//   hoursWorked: string;
//   status: 'pending' | 'approved' | 'rejected';
//   managerComments?: string;
// }

// const initialForms = [
//     {
//         id: '1',
//         employeeName: 'John Doe',
//         date: '2023-06-01',
//         department: 'Engineering',
//         taskDetails: 'Implemented new feature X',
//         hoursWorked: '8',
//         status: 'pending',
//     },
//     {
//         id: '2',
//         employeeName: 'Jane Smith',
//         date: '2023-06-02',
//         department: 'Marketing',
//         taskDetails: 'Created content for social media campaign',
//         hoursWorked: '6',
//         status: 'pending',
//     },
// ];

const ManagerApprovalDashboard = () => {
    const [selectedForm, setSelectedForm] = useState(null);
    // const [roles, setRoles] = useState([]);
    const [taskReports, setTaskReports] = useState([]);
    const [forms, setForms] = useState(taskReports);



    const fetchTaskReports = async () => {
        try {
            await axiosInstance
                .get('/api/task-reports')
                .then((response) => {
                    console.log('taskReports ==>', response.data);
                    setTaskReports(response.data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    useEffect(() => {
        fetchTaskReports();
    }, []);

    const formik = useFormik({
        initialValues: {
            managerComments: '',
        },
        validationSchema: Yup.object({
            managerComments: Yup.string().required(
                'Comments are required before approving or rejecting',
            ),
        }),
        onSubmit: (values, { resetForm }) => {
            if (selectedForm) {
                const updatedForms = forms.map((form) =>
                    form.id === selectedForm.id
                        ? {
                              ...form,
                              status: 'approved',
                              managerComments: values.managerComments,
                          }
                        : form,
                );
                setForms(updatedForms);
                setSelectedForm(null);
                resetForm();
            }
        },
    });

    const handleFormSelect = (form) => {
        setSelectedForm(form);
        formik.setFieldValue('managerComments', form.managerComments || '');
    };

    const handleReject = () => {
        if (selectedForm && formik.values.managerComments) {
            const updatedForms = forms.map((form) =>
                form.id === selectedForm.id
                    ? {
                          ...form,
                          status: 'rejected',
                          managerComments: formik.values.managerComments,
                      }
                    : form,
            );
            setForms(updatedForms);
            setSelectedForm(null);
            formik.resetForm();
        } else {
            formik.setFieldError(
                'managerComments',
                'Comments are required before rejecting',
            );
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-4 text-2xl font-bold">
                Manager Approval Dashboard
            </h1>
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="w-full md:w-1/2">
                    <h2 className="mb-2 text-xl font-semibold">
                        Submitted Forms
                    </h2>
                    {taskReports.map((form) => (
                        <div
                            key={form.id}
                            className={`mb-2 cursor-pointer rounded border p-4 ${
                                selectedForm?.id === form.id
                                    ? 'border-blue-500'
                                    : 'border-gray-200'
                            } ${
                                form.status === 'approved'
                                    ? 'bg-green-100'
                                    : form.status === 'rejected'
                                      ? 'bg-red-100'
                                      : 'bg-white'
                            }`}
                            onClick={() => handleFormSelect(form)}
                        >
                            <h3 className="font-semibold">
                                {form.employeeName}
                            </h3>
                            <p>Date: {form.date}</p>
                            <p>Department: {form.department}</p>
                            <p>Status: {form.status}</p>
                        </div>
                    ))}
                </div>
                <div className="w-full md:w-1/2">
                    {selectedForm ? (
                        <div>
                            <h2 className="mb-2 text-xl font-semibold">
                                Form Details
                            </h2>
                            <div className="mb-4 rounded bg-gray-100 p-4">
                                <p>
                                    <strong>Employee:</strong>{' '}
                                    {selectedForm.employee_name}
                                </p>
                                <p>
                                    <strong>Date:</strong> {selectedForm.date}
                                </p>
                                <p>
                                    <strong>Department:</strong>{' '}
                                    {selectedForm.department}
                                </p>
                                <p>
                                    <strong>Task Details:</strong>{' '}
                                    {selectedForm.task_details}
                                </p>
                                <p>
                                    <strong>Hours Worked:</strong>{' '}
                                    {selectedForm.hours_worked}
                                </p>
                                <p>
                                    <strong>Status:</strong>{' '}
                                    {selectedForm.status}
                                </p>
                            </div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="mb-4">
                                    <label
                                        htmlFor="managerComments"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Manager Comments
                                    </label>
                                    <textarea
                                        id="managerComments"
                                        name="managerComments"
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.managerComments}
                                    />
                                    {formik.touched.managerComments &&
                                    formik.errors.managerComments ? (
                                        <div className="mt-1 text-sm text-red-500">
                                            {formik.errors.managerComments}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={handleReject}
                                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            Select a form to view details and approve/reject
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerApprovalDashboard;
