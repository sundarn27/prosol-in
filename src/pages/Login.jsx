import React, { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import axios from "axios";
import { Button, Card, Checkbox, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import users from "../users.json";
import loginImage from "../images/login.png";
import titleImage from "../images/title_black.jfif";
import Sidebar from "../components/Sidebar";

const SubmitButton = styled(LoadingButton)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  color: "white",
  "&:hover": {
    backgroundColor: purple[700],
  },
}));

const Login = () => {
  const navigate = useNavigate();

  const [err, setErr] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(users);

  // const navigate = useNavigate();

  // const handleLogin1 = async (e) => {
  //   setLoading(true)
  //   e.preventDefault();
  //   try {
  //     console.log(email,password);
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     console.log(userCredential);
  //     const user = userCredential.user;
  //     console.log('User:', user);
  //     dispatch({ type: 'LOGIN', payload: user });
  //     setLoading(false)
  //     navigate('/index');
  //   } catch (error) {
  //     console.error('Login Error:', error);
  //     setErr(true);
  //     setLoading(false)
  //   }
  // };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("http://localhost:50129/api/GetToken", {
  //       username,
  //       password,
  //     });
  //     console.log(response.data);
  //     const userData = response.data;
  //     sessionStorage.setItem("userData", JSON.stringify(userData));
  //     console.log(userData)
  //     setLoading(false);
  //     // navigate("/index");
  //   } catch (error) {
  //     console.error("Login Error:", error);
  //     setErr(true);
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e) => {
    var credentials = userData.find((i) => i.userName == username);
    if (credentials) {
      if (credentials.password == password) {
        console.log(username);
        console.log(password);
        navigate("/Home");
      }
    }
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

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
              onFinish={handleLogin}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="input password"
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
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );

  // return(
  //   <>
  //   <Sidebar/>
  //   </>
  // )
};

export default Login;
