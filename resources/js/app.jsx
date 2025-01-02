import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import RoleDashboard from './Pages/RoleDashboard';
import TaskForm from './Pages/TaskForm';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    // setup({ el, App, props }) {
    //     const root = createRoot(el);

    //     root.render(<App {...props} />);
    // },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <BrowserRouter>
                <Routes>
                    {/* Define React Router routes here */}
                    <Route path="/task-form" element={<TaskForm />} />
                    <Route path="/assign-roles" element={<RoleDashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<App {...props} />} />
                </Routes>
            </BrowserRouter>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
