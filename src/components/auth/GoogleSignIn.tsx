import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';

const GoogleSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Send to backend to create/update user
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          googleId: user.uid,
          profilePicture: user.photoURL
        })
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setCredentials({ user: data.user, token: data.token }));
        toast.success('Successfully signed in with Google!');
        navigate('/dashboard');
      } else {
        throw new Error('Failed to authenticate with backend');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 hover:bg-muted"
    >
      <FaGoogle className="h-4 w-4" />
      {loading ? 'Signing in...' : 'Continue with Google'}
    </Button>
  );
};

export default GoogleSignIn;