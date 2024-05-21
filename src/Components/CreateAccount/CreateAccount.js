import noblesshieldblue from './noblesshieldblue.png';
import './CreateAccount.css';
import { useState } from 'react'; // Import useState hook for managing state
import axios from 'axios'; // Import Axios for making HTTP requests
import { useNavigate } from 'react-router-dom';

function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const passwordCriteria = {
    length: password.length >= 8,
    capital: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    if (!/nobles\.edu$/.test(value)) {
      setUsernameError("Please enter your Nobles email address");
    } else {
      setUsernameError('');
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    const criteriaMet = Object.values(passwordCriteria).every(Boolean);
    if (!criteriaMet) {
      setPasswordError("Password does not meet all criteria");
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (usernameError || passwordError || confirmPasswordError) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://nobles-dao-api-276edade8fdf.herokuapp.com/create_account', {
        email: username,
        password: password
      });

      console.log("User ID:", response.data.userId);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setSubmitted(true);
      setErrorMessage(''); // Clear any previous error message
    } catch (error) {
      console.error("Error creating account:", error);
      if (error.response.data.error === "EMAIL_EXISTS") {
        setErrorMessage("This email is already in use."); // Set error message from backend
      } else {
        setErrorMessage("An error occurred while creating your account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  // Function to handle redirecting to the login page
  const redirectToLoginPage = () => {
    // Logic to redirect to the login page
    navigate('/login');
    console.log("Redirecting to login page...");
  };

  return (
    <div className="container">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {!submitted ? (
        <div>
          <h1>Create Account</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                placeholder="Enter your username" 
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
              />
              {usernameError && <p className="error-message">{usernameError}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Create a password:</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              {passwordError && <p className="error-message">{passwordError}</p>}
              <ul className="password-criteria">
                <li className={passwordCriteria.length ? 'valid' : 'invalid'}>
                  Contain at least 8 characters
                </li>
                <li className={passwordCriteria.capital ? 'valid' : 'invalid'}>
                  Contain both lower and uppercase letters
                </li>
                <li className={passwordCriteria.number ? 'valid' : 'invalid'}>
                  Contain at least one number
                </li>
                <li className={passwordCriteria.special ? 'valid' : 'invalid'}>
                  Contain at least one special character
                </li>
              </ul>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password:</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="Confirm your password" 
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              />
              {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
            </div>
            <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button>
          </form>
          <div className="logo-container">
            <img src={noblesshieldblue} alt="Nobles Shield Blue" className="nobles-shield-blue" />
          </div>
        </div>
      ) : (
        <div>
          <h1>Account Created</h1>
          <button onClick={redirectToLoginPage}>Go to Log In</button>
        </div>
      )}
    </div>
  );
}

export default CreateAccount;
