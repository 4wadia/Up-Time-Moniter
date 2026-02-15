import React, { useState } from 'react';
import { PageView } from '../types';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface LoginPageProps {
    onNavigate: (page: PageView) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!validate()) return;

        setIsLoading(true);
        try {
            await login(email, password);
            // Navigation handled by App.tsx effect (isAuthenticated check)
            // But we can trigger a re-render or explicit navigation if needed,
            // though state update in context should trigger App re-render.
            // For safety, we can call onNavigate('dashboard') but the effect in App is better.
        } catch (err: any) {
            setErrors({ form: err.message || 'Failed to login' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-[400px] bg-background border border-border rounded-2xl shadow-sm p-8 md:p-10">
                {/* Header */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 border border-green-100">
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground tracking-tight">Sign in to Sentinel</h1>
                    <p className="text-sm text-muted mt-2">Welcome back! Please enter your details.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.form && (
                        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-600 mb-4">
                            {errors.form}
                        </div>
                    )}

                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                        error={errors.password}
                    />

                    <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                            <span className="text-muted-foreground">Remember for 30 days</span>
                        </label>
                        <button type="button" className="text-primary font-medium hover:underline">Forgot password</button>
                    </div>

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Sign In
                    </Button>

                    <Button type="button" variant="outline" fullWidth className="flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </Button>
                </form>

                <div className="mt-6 text-center text-xs text-muted">
                    Don't have an account?{' '}
                    <button onClick={() => onNavigate('signup')} className="text-foreground font-medium hover:underline">
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
};
