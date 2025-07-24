import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/userContext.jsx';
import axios from 'axios';
import { Link } from 'react-router-dom';


export default function Profile() {


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 space-y-8">
            <div className="fixed top-4 left-4">
                <Link to="/dashboard" className="flex items-center text-gray-300 hover:text-white transition-colors">
                    <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4 flex justify-center pt-20">Profile & Settings</h2>
            <form>
                <div>
                    <label className="block font-medium text-white flex justify-center">Avatar</label>
                </div>
            </form>


        </div>
    )
}