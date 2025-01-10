import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/PDI_color_Logo.jpg'

function Login({ setIsAuthenticated }) {
  const [error, setError] = useState("");
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const userDataFromLocalStorage = JSON.parse(localStorage.getItem('userData'));
    console.log(userDataFromLocalStorage);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      const { token, userRole, userData } = data;

      // Store the token
      localStorage.setItem("jwtToken", token);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userData', JSON.stringify(userData));

      if (userRole === "Organizer") {
        nav("/organizer");
      } else if (userRole === "Reviewer") {
        nav("/reviewer");
      } else if (userRole === null) {
        nav("/participant");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* Added Image */}
          <img 
            src={logo}
            alt="PDI Logo" 
            className="mx-auto w-1/2 h-1/2 mb-16"
          /> 
          {/* Updated Title */}
          <h2 className="mt-6 text-center text-blue-800 text-3xl font-extrabold">
            Sign in to PDI Hackathon
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-secondary focus:border-secondary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group bg-blue-800 relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Forgot password
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
