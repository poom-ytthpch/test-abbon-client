"use client";
import React, { useEffect, useState } from "react";
import {
  AppstoreAddOutlined,
  BorderOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";

import { useRouter } from "next/navigation";
import ApolloWrapper from "../apollo/wrapper";
import Item from "antd/es/list/Item";
import { jwtDecode } from "../jwt";
import { useMutation } from "@apollo/react-hooks";
import { RefreshTokenMutation } from "@/gql";

const { Header, Sider, Content } = Layout;

type Item = {
  key: string;
  icon: React.ReactNode;
  label: string;
};

let Items: Item[] = [
  {
    key: "EXPENSE",
    icon: <UserOutlined />,
    label: "Expense",
  },
  {
    key: "LOGOUT",
    icon: <LogoutOutlined />,
    label: "Logout",
  },
];

const Container = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [getRefreshToken] = useMutation(RefreshTokenMutation, {
    onCompleted(data) {
      console.log({ data });
      window.localStorage.setItem("accessToken", data.refreshToken.token);
      window.localStorage.setItem(
        "refreshToken",
        data.refreshToken.refreshToken
      );
      router.push(`/${localStorage.getItem("page")}`);
    },
    onError(error) {
      console.log(error);
      localStorage.clear();
      router.push("/login");
    },
  });

  const page = localStorage.getItem("page") ?? "expense";
  const accessToken = localStorage.getItem("accessToken") ?? "";
  const refreshToken = localStorage.getItem("refreshToken") ?? null;

  useEffect(() => {
    if (accessToken != "") {
      const token = jwtDecode(accessToken);

      const expires = new Date(token.payload.exp * 1000);
      const now = new Date();
      if (expires < now) {
        console.log("Refresh Token");
        getRefreshToken({
          variables: {
            accessToken: refreshToken,
          },
        });
      }
    }

    if (!accessToken || accessToken == "") {
      router.push("/login");
    } else {
      if (page) {
        router.push("/" + page);
      } else {
        localStorage.setItem("page", "expense");
        router.push("/expense");
      }
    }
  }, []);

  const handleChangePage = (page: string) => {
    localStorage.setItem("page", page);
    console.log({ page });
    router.push(`/${page}`);
  };

  return accessToken ? (
    <ApolloWrapper>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            onClick={(menu) =>
              menu.key === "LOGOUT"
                ? (localStorage.clear(), router.push("/login"))
                : handleChangePage(menu.key.toLocaleLowerCase())
            }
            defaultSelectedKeys={["0"]}
            items={Items.filter((item) => item)}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: "100vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ApolloWrapper>
  ) : (
    <></>
  );
};

export const DefaultLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ApolloWrapper>
      <Container>{children}</Container>
    </ApolloWrapper>
  );
};

export default DefaultLayout;
