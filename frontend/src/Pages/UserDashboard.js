import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFormik } from "formik";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const UserDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [user, setUser] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [userTasks, setuserTasks] = useState([]);
  const [date, setdate] = useState("");
  const isTokenValid = (token) => {
    try {
      console.log(token);
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decodedToken.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  const getUserData = async (email) => {
    try {
      const response = await axios.post(
        "http://localhost:2000/users/api/getUserByEmail",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        console.log(response);
      setUser(response.data.user);
      console.log(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle any errors, e.g., display an error message on the frontend
    }
  };

  useEffect(() => {
    const userEmail = jwtDecode(token).email;
    getUserData(userEmail);
    
  }, [token]);

  useEffect(() => {
    // Check the token's expiration status every second (you can adjust the interval as needed)
    const tokenExpirationCheck = setInterval(() => {
      if (!token || !isTokenValid(token)) {
        // Token is not valid or has expired, log the user out
        clearInterval(tokenExpirationCheck);
        alert('Your login session has expired please login again')
        localStorage.removeItem("accessToken");

        navigate("/login");
      }
    }, 1000); // Interval in milliseconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(tokenExpirationCheck);
    };
  }, [navigate, token]);

  const handleLogout = () => {
    // Delete the access token from localStorage on logout
    localStorage.removeItem("accessToken");
    // Redirect to the login page after logout
    navigate("/login");
  };

  const onSubmit = (values)=>{
    setIsLoading(true);
    const data = {
      title: values.title,
      description: values.description,
      assignedUser: user.fullName,
      dueDate: date,
      email: user.email
    };
    console.log(data);
    const uri = "http://localhost:2000/users/save"
    axios
      .post(uri, data)
      .then((response) => {
        console.log(response);
        alert(response.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  
  const viewTasks = ()=>{
    const uri = "http://localhost:2000/users/getTasks";
    axios.get(uri).then((response)=>{
      console.log(response);
      setuserTasks(response.data)
      console.log(userTasks);
      const initialExpandedTasks = {};
      userTasks.forEach((userTasks) => {
        initialExpandedTasks[userTasks._id] = false; // Set initial visibility to false for each task
      });
      // Update the expandedTasks state with the initial visibility state
      setExpandedTasks(initialExpandedTasks);
    })
  }

  useEffect(()=>{
    viewTasks()
  }, [])


  const handleDelete = (taskId) => {
    const uri = "http://localhost:2000/users/deletePost";
    axios
      .post(uri, taskId)
      .then((response) => {
        console.log(response.data); // Optional: Log the response data from the server
        // If the deletion is successful, you may want to update the userTasks state
        // to remove the deleted post from the list displayed on the frontend
        // For example, you can use a filter method to remove the post with the given postId
        setuserTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        // Handle any errors, e.g., display an error message on the frontend
      });
  };


  const { handleSubmit, handleChange, errors, touched, handleBlur, values } =
    useFormik({
      initialValues: {
        title: "",
        description: "",
      },
      onSubmit,
    });

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 z-10 bg-opacity-75 backdrop-filter backdrop-blur-sm">
          <div className="flex items-center justify-center h-screen">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      ) : null}
      {user ? (
        <>
          <h1>Welcome to your dashboard, {user.fullName}</h1>
        </>
      ) : (
        <p>Loading user information...</p>
      )}
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
      <div className="flex justify-center shadow-xl">
        <form onSubmit={handleSubmit} className="my-4 w-50 sm:w-screen">
          <input
            type="text"
            className="border my-2 w-100"
            name="title"
            onChange={handleChange}
            placeholder="Title"
          />
          <input
            type="text"
            onChange={handleChange}
            className="border my-2 w-100"
            name="description"
            placeholder="Description"
          />
          <input
            type="text"
            defaultValue={user ? user.fullName : ""}
            className="border my-2 w-100"
            name="assignedUser"
            onChange={handleChange}
            placeholder="Assigned User"
          />
          <ReactDatePicker
            placeholderText="Due Date"
            className="border w-100"
            name="dueDate"
            selected={date}
            onChange={(date) => setdate(date)}
          />
          <br />
          <br />
          <button type="submit" className="btn btn-primary">
            Add task
          </button>
        </form>
      </div>
      <div className="mt-5">
        <h2 className="text-xl mb-3">Your Tasks:</h2>
        <ul>
          {userTasks.map((task) => (
            <li key={task._id} className="border rounded-lg mb-4 p-3">
              <h3
                className="cursor-pointer font-bold"
                onClick={() =>
                  setExpandedTasks((prevState) => ({
                    ...prevState,
                    [task._id]: !prevState[task._id],
                  }))
                }
              >
                {task.title}
              </h3>
              {expandedTasks[task._id] && (
                <div className="mt-2">
                  <p>Description: {task.description}</p>
                  <p>Due Date: {task.dueDate}</p>
                  <button className="btn btn-primary">Update</button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task._id);
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      ;
    </>
  );
};

export default UserDashboard;
