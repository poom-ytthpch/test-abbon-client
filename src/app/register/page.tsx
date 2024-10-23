"use client";
import { useMutation } from "@apollo/react-hooks";
import { RegisterMutation } from "@/gql/auth";
import { RegisterRequest, RegisterResponse } from "@/type/auth";
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
  confirmPassword: string;
  userName: string;
};

type RegisterInput = {
  input: RegisterRequest;
};

type RegisterRes = {
  register: RegisterResponse;
};

export default function Login() {
  const router = useRouter();

  const accessToken = localStorage.getItem("accessToken")
    ? localStorage.getItem("accessToken")
    : null;

  const [loading, setLoading] = useState(true);

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

  const [register] = useMutation<RegisterRes, RegisterInput>(RegisterMutation, {
    onCompleted: (data) => {
      console.log({ data });

      alertSuccess("Register Success");
      router.push("/login");
    },

    onError(error) {
      alertError(error.message, "Register Failed");
    },
  });

  const handleRegister = async (input: FieldType) => {
    const { email, password, confirmPassword, userName } = input;

    console.log({ email, password, confirmPassword, userName });

    await register({
      variables: {
        input: {
          email,
          password,
          confirmPassword,
          userName,
        },
      },
    });
  };

  return !loading ? (
    <div className="h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h4 className="text-black text-lg font-bold mb-4">Register</h4>

        <div className="flex justify-center w-[600px]">
          <Form onFinish={handleRegister} form={form}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 18 }}
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
              label="Name"
              name="userName"
              rules={[{ required: true, message: "Please input your name!" }]}
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 18 }}
            >
              <Input
                name="userName"
                type="text"
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Name"
                style={{ width: "300px" }}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject("Please input your password!");
                    }
                    if (value.length < 8) {
                      return Promise.reject(
                        "Password must be at least 8 characters."
                      );
                    }
                    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(value)) {
                      return Promise.reject(
                        "Password must contain at least one lowercase letter, one uppercase letter, and one number."
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 18 }}
            >
              <Input
                name="password"
                type="password"
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Passwords"
                style={{ width: "300px" }}
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 18 }}
            >
              <Input
                name="confirmPassword"
                type="password"
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Confirm Passwords"
                style={{ width: "300px" }}
              />
            </Form.Item>

            <div className="flex justify-center">
              <Button
                type="primary"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Back To Login
              </Button>
              <Button type="primary" htmlType="submit">
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
