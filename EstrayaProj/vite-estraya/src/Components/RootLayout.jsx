import { Outlet } from 'react-router-dom';
import HamburgerMenu from './Hamburger';
import Sidebar from './Sidebar';

export default function RootLayout() {
    return (
        <div className='root-layout'>
            <div className="app-container">
                <Sidebar />
                <HamburgerMenu />
                <Outlet />
            </div>
        </div>
    )
}