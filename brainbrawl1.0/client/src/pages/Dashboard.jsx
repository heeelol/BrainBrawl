import { useContext } from 'react';
import { UserContext } from '../../context/userContext.jsx';

export default function Dashboard() {
    const {user} = useContext(UserContext)
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}