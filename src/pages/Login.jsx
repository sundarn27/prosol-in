import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin } from "../features/authSlice";
import loginImage from "../images/login.png";
import { Alert, Button, Card, Checkbox, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { fetchUserDetails } from "../features/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [userError, setUserError] = useState("");
  const [notUser, setNotUser] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [notPassword, setNotPassword] = useState(false);
  const [isError, setIsError] = useState("");

  const onClose = (e) => {
    console.log(e, "I was closed.");
    setIsError("");
  };

  useEffect(() => {
    if (username === "") {
      setNotUser(true);
      setUserError("Please input your Username!");
    }
    if (password === "") {
      setNotPassword(true);
      setPasswordError("Please input your Password!");
    }
  });

  const handleLogin = useCallback(async () => {
    console.log("Login button clicked");

    try {
      const resultAction = await dispatch(
        fetchLogin({ Username: username, Password: password })
      );

      console.log("Result of fetchLogin:", resultAction);

      if (fetchLogin.fulfilled.match(resultAction)) {
        console.log("Login Successful:", resultAction.payload);
        const credentials = resultAction.payload;

        if (!credentials || !credentials.access_token) {
          setIsError("Invalid Credentials");
          setNotUser(true);
          setUserError("Check your Username!");
          setNotPassword(true);
          setPasswordError("Check your Password!");
        } else {
          // Fetch user data after successful login
          const userListAction = await dispatch(fetchUserDetails({ username }));

          console.log("User List Response:", userListAction);

          if (fetchUserDetails.fulfilled.match(userListAction)) {
            const userData = userListAction.payload;

            // Store user data in sessionStorage
            Object.entries(userData).forEach(([key, value]) => {
              sessionStorage.setItem(key, value);
            });
            navigate("/Home");
            console.log("User data stored in sessionStorage:", userData);
          } else {
            console.error("Failed to fetch user list:", userListAction.payload);
          }
        }
      } else {
        console.error("Login Failed:", resultAction.payload);
      }
    } catch (error) {
      console.error("Dispatch error:", error);
    }
  }, [dispatch, username, password]);

  return (
    <>
      <div className="login-container">
        <div className="image-container">
          <img src={loginImage} alt="Login" />
        </div>
        <div className="login-container">
          <Card>
            {/* <img src={titleImage} alt="Supply Bee" /> */}
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              //onFinish={handleLogin}
            >
              {isError !== "" ? (
                <Alert
                  message={isError}
                  showIcon
                  type="error"
                  closable
                  onClose={onClose}
                />
              ) : null}
              <br />
              <Form.Item
                name="username"
                rules={[
                  {
                    required: { notUser },
                    message: userError,
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: { notPassword },
                    message: passwordError,
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  className="login-form-button"
                  onClick={handleLogin}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
                {/* {error && <p style={{ color: "red" }}>Error: {error}</p>}
                {user && <p>Welcome, {user.username}!</p>} */}
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;
