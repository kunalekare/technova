import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMe } from '../../redux/slices/authSlice';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            localStorage.setItem('accessToken', token);

            dispatch(getMe())
                .unwrap()
                .then((res) => {
                    const isAdmin = res.user?.role?.name === 'admin' || res.user?.role?.name === 'super_admin';
                    navigate(isAdmin ? '/admin' : '/dashboard');
                })
                .catch(() => navigate('/login?error=oauth_failed'));
        } else {
            navigate('/login?error=oauth_failed');
        }
    }, [dispatch, navigate, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <h2>Signing you in...</h2>
        </div>
    );
};

export default AuthCallback;