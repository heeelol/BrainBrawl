import { Link, useNavigate } from 'react-router-dom';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {Bars3Icon, BellIcon, UserCircleIcon, XMarkIcon} from '@heroicons/react/24/outline'
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/userContext.jsx';
import logo from '../assets/brainbrawl_icon.png';
import { avatarMap } from "../assets/avatars.js";
import noobbrain from "../assets/noobbrain.jpg";
import mtfuji from "../assets/mtFuji.jpg";

const getNavigation = (isAuthenticated) => [
    ...(isAuthenticated ? [
        { name: 'Dashboard', href: '/dashboard', current: false },
        { name: 'Shop', href: '/shop', current: false },
        { name: 'Leaderboard', href: '/leaderboard', current: false },
        { name: 'Insights', href: '/insights', current: false },
    ] : [])
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const navigation = getNavigation(!!user);
    const [selectedAvatar, setSelectedAvatar] = useState("");

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            setUser(null);
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Error logging out');
        }
    };

    const handleNavigation = (e, href) => {
        e.preventDefault();
        if (!user && (href === '/dashboard' || href === '/quiz')) {
            toast.error('You must be logged in to access this page');
            navigate('/login');
            return;
        }
        navigate(href);
    };

    useEffect(() => {
        if (user?.email) {
             axios.get(`/ownership/${user.email}`)
                .then(res => {
                    if (res.data) {
                        setSelectedAvatar(res.data.selected_avatar || "");
                    }
                })
                .catch(() => {
                    setSelectedAvatar("");
                });
        }
    }, [user]);

    return (
        <Disclosure as="nav" className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <Link
                                to="/"
                            >
                                <img
                                    alt="BrainBrawl"
                                    src={logo}
                                    className="h-10 w-auto"
                                />
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => handleNavigation(e, item.href)}
                                        className={classNames(
                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium'
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <button
                            type="button"
                            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                        >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon aria-hidden="true" className="size-6" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-gray-800 focus:ring-2 hover:scale-105">
                                    <img
                                        src={avatarMap[selectedAvatar] || noobbrain}
                                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300"
                                    />
                                </MenuButton>
                            </div>
                            <MenuItems
                                transition
                                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-teal-500 py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                            >
                                <MenuItem>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-teal-400"
                                    >
                                        Your Profile
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full px-4 py-2 text-left text-sm font-semibold text-stone-700 hover:text-red-400 hover:bg-teal-400"
                                    >
                                        Sign out
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            onClick={(e) => handleNavigation(e, item.href)}
                            className={classNames(
                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium'
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}