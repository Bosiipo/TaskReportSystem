import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// <BrowserRouter>
//     <Routes>
{
    /* Define React Router routes here */
}
// <Route
//     path="/task-reports"
//     element={<ManagerApprovalDashboard />}
// />
// <Route path="/task-form" element={<TaskForm />} />
// <Route path="/assign-roles" element={<RoleDashboard />} />
// <Route path="/dashboard" element={<Dashboard />} />
// <Route path="/" element={<App {...props} />} />
//     </Routes>
// </BrowserRouter>,
