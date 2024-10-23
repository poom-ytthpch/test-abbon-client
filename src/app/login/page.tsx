"use client";
import { useMutation } from "@apollo/react-hooks";
import { LoginMutation } from "@/gql/auth";
import { LoginResponse, LoginRequest } from "@/type/auth";
import { Button, Form, Input } from "antd";
import { alertError, alertSuccess } from "@/components/common/alert";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { jwtDecode } from "@/components/jwt";
type FieldType = {
  email: string;
  password: string;
};

type LoginInput = {
  input: LoginRequest;
};

type LoginRes = {
  login: LoginResponse;
};

export default function Login() {
  const router = useRouter();

  const accessToken = localStorage.getItem("accessToken")
    ? localStorage.getItem("accessToken")
    : null;

  const [loading, setLoading] = useState(true);

  const [register, setRegister] = useState(false);

  useEffect(() => {
    if (accessToken) {
      router.push("/expense");
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const handleSubmit = (values: any) => {
    console.log("Success:", values);
  };

  const [form] = Form.useForm<FieldType>();

  const handleError = (errorInfo: string) => {};

  const [login] = useMutation<LoginRes, LoginInput>(LoginMutation, {
    onError(error) {
      alertError(error.message, "Login Failed");
    },
    onCompleted: async (data) => {
      if (data.login.status) {
        alertSuccess("Login Success");

        const decode = (await jwtDecode(data.login.token)) || {};

        localStorage.setItem("accessToken", data.login.token);
        localStorage.setItem("refreshToken", data.login.refreshToken);
        localStorage.setItem("userId", decode?.payload.userInfo.id);
        localStorage.setItem("page", "expense");

        router.push("/expense");
      }
    },
  });

  const handleLogin = async (input: FieldType) => {
    const { email, password } = input;

    await login({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };

  return !loading ? (
    <div className="h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h4 className="text-black text-lg font-bold mb-4">Login</h4>

        <div className="flex justify-center w-[400px]">
          <Form onFinish={handleLogin} form={form}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 15 }}
            >
              <Input
                name="email"
                type="email"
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Email"
                style={{ width: "300px" }}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 15 }}
            >
              <Input
                name="password"
                type="password"
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Passwords"
                style={{ width: "300px" }}
              />
            </Form.Item>

            <div className="flex justify-center">
              <Button type="primary" htmlType="submit">
                Login
              </Button>

              <Button
                type="primary"
                onClick={() => {
                  router.push("/register");
                }}
              >
                Register
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
