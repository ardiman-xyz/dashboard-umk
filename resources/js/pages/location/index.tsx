import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const Location = () => {
    return (
        <AppLayout>
            <Head title="Map" />
            <div className="space-y-6 p-4">
                <div>Location</div>
            </div>
        </AppLayout>
    );
};

export default Location;
