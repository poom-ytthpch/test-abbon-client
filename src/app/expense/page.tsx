"use client";

import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Button, Card, Modal, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  CategoriesQuery,
  CreateExpenseMutation,
  ExpenseReportQuery,
  ExpensesQuery,
  RemoveExpenseMutation,
  UpdateExpenseMutation,
} from "../../gql";
import {
  Expense,
  ExpensesInput,
  CategoriesInput,
  Category,
  ExpenseReport,
} from "../../type/expense";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import ExpenseEditor from "../../components/expense/editor";
import { alertError, alertSuccess } from "../../components/common/alert";
import moment from "moment";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { confirm } = Modal;

const { RangePicker } = DatePicker;

type Category = {
  id: string;
  name: string;
};

type ExpenseColumn = {
  id: string;
  title: string;
  amount: number;
  date: Date;
  category: Category;
  notes: string;
};

type ExpensesReq = {
  input: ExpensesInput;
};

type ExpenseRes = {
  expenses: Expense[];
};

type CategoriesQueryInput = {
  input: CategoriesInput;
};

type CategoriesQueryRes = {
  categories: Category[];
};

type ExpensesColumnType = {
  categories: Category[];
  handleUpdateExpense: (val: Expense, modal: any, update: boolean) => void;
  handleRemoveExpense: (id: string) => void;
};

const ExpensesColumn = ({
  categories,
  handleUpdateExpense,
  handleRemoveExpense,
}: ExpensesColumnType): ColumnsType<Expense> => [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    align: "left",
    sorter: (a, b) => a?.title?.localeCompare(b?.title),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    align: "left",
    sorter: (a, b) => a?.amount - b?.amount,
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    align: "left",
    sorter: (a, b) => new Date(a?.date).getDate() - new Date(b?.date).getDate(),
    render: (_, val) => moment(val?.date).format("DD/MM/YYYY HH:mm:ss"),
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    align: "left",
    sorter: (a, b) => a?.category?.name.localeCompare(b?.category?.name),
    render: (_, val) => val?.category?.name,
  },
  {
    title: "Note",
    dataIndex: "notes",
    key: "notes",
    align: "left",
    render: (_, val) => (val?.notes ? val.notes : "-"),
  },
  {
    title: "Edit/Delete",
    align: "center",
    render: (val) => (
      <>
        <Button
          className="mr-2"
          onClick={() => {
            const modal = confirm({
              title: "Update",
              icon: null,

              content: (
                <>
                  <ExpenseEditor
                    update={true}
                    expense={val as Expense}
                    categories={categories}
                    handleUpdateExpense={
                      (val: Expense) => handleUpdateExpense(val, modal, true) // ส่ง modal ไปที่ฟังก์ชัน handleUpdateExpense
                    }
                  />
                </>
              ),
              okButtonProps: { style: { display: "none" } },
              onCancel() {},
            });
          }}
        >
          Edit
        </Button>
        <Button
          danger
          onClick={() => {
            confirm({
              title: "Are you sure delete this expense?",
              icon: <ExclamationCircleFilled />,
              okText: "Yes",
              okType: "danger",
              centered: true,
              cancelText: "No",
              onOk() {
                handleRemoveExpense(val?.id);
              },
              onCancel() {},
            });
          }}
        >
          Delete
        </Button>
      </>
    ),
  },
];

const ExpensesSumaryColumn = (): ColumnsType<ExpenseReport> => [
  {
    title: "Total",
    dataIndex: "amount",
    key: "amount",
    align: "left",
    sorter: (a, b) => a?.amount - b?.amount,
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    align: "left",
    sorter: (a, b) => a?.category.localeCompare(b?.category),
  },
  {
    title: "Name",
    dataIndex: "userName",
    key: "",
    align: "left",
    sorter: (a, b) => a?.userName.localeCompare(b?.userName),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    align: "left",
    sorter: (a, b) => moment(a?.date).unix() - moment(b?.date).unix(),
    render: (_, val) => moment(val?.date).format("DD/MM/YYYY HH:mm:ss"),
  },
];

export default function ExpensePage() {
  const [expenses, { data: data, loading }] = useLazyQuery<
    ExpenseRes,
    ExpensesReq
  >(ExpensesQuery, {
    onError(error) {
      alertError(error.message, "Get Expenses Failed");
    },
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [reportStartDate, setReportStartDate] = useState(new Date());
  const [reportEndDate, setReportEndDate] = useState(new Date());

  const [categories, { data: categoriesData, loading: categoriesLoading }] =
    useLazyQuery<CategoriesQueryRes, CategoriesQueryInput>(CategoriesQuery);

  useEffect(() => {
    categories({
      variables: {
        input: {
          take: 100,
          skip: 0,
        },
      },
    });
  }, []);

  const [updateExpense, { data: updateData }] = useMutation(
    UpdateExpenseMutation,
    {
      onCompleted() {
        alertSuccess("Update Expense Success");
      },
      onError(error) {
        alertError(error.message, "Update Expense Failed");
      },
    }
  );

  const [createExpense, { data: createData }] = useMutation(
    CreateExpenseMutation,
    {
      onCompleted() {
        alertSuccess("Create Expense Success");
      },
    }
  );

  const [removeExpense, { data: removeData }] = useMutation(
    RemoveExpenseMutation,
    {
      onCompleted() {
        alertSuccess("Remove Expense Success");
      },
      onError(error) {
        alertError(error.message, "Remove Expense Failed");
      },
    }
  );

  const [ExpenseReport, { loading: reportLoading, data: reportData }] =
    useLazyQuery(ExpenseReportQuery, {
      onError(error) {
        alertError(error.message, "Get Expense Report Failed");
      },
    });

  const userId = localStorage.getItem("userId") ?? "";

  const handleSetStartEndDate = (val: any) => {
    setStartDate(val[0]);
    setEndDate(val[1]);
  };

  const handleSetReportStartEndDate = (val: any) => {
    setReportStartDate(val[0]);
    setReportEndDate(val[1]);
  };

  useEffect(() => {
    expenses({
      variables: {
        input: {
          userId,
          startDate,
          endDate,
          take: 100,
          skip: 0,
        },
      },
    });
  }, [startDate, endDate, updateData, createData, removeData]);

  useEffect(() => {
    ExpenseReport({
      variables: {
        input: {
          userId,
          startDate: reportStartDate,
          endDate: reportEndDate,
          take: 100,
          skip: 0,
        },
      },
    });
  }, [reportStartDate, reportEndDate, data, updateData, removeData]);

  const handleUpdateExpense = async (
    val: Expense,
    modal: any,
    update: boolean
  ) => {
    modal.destroy();

    if (update) {
      await updateExpense({
        variables: {
          input: {
            id: val.id,
            title: val.title,
            amount: Number(val.amount),
            categoryId: val.categoryId,
            notes: val.notes,
            date: val.date,
          },
        },
      });
    } else {
      await createExpense({
        variables: {
          input: {
            userId: userId,
            title: val.title,
            amount: Number(val.amount),
            categoryId: val.categoryId,
            notes: val?.notes,
            date: val.date,
          },
        },
      });
    }
  };

  const handleRemoveExpense = async (id: string) => {
    await removeExpense({
      variables: {
        id,
      },
    });
  };

  return (
    <div className="w-full">
      <div className="flex flex-row align-top">
        <div className="mr-4">
          <Card
            title="List of Expense"
            extra={
              <Button
                onClick={() => {
                  const modal = confirm({
                    title: "Create",
                    icon: null,

                    content: (
                      <>
                        <ExpenseEditor
                          update={false}
                          categories={categoriesData?.categories || []}
                          handleUpdateExpense={
                            (val: Expense) =>
                              handleUpdateExpense(val, modal, false) // ส่ง modal ไปที่ฟังก์ชัน handleUpdateExpense
                          }
                        />
                      </>
                    ),
                    okButtonProps: { style: { display: "none" } },
                    onCancel() {},
                  });
                }}
              >
                Create Expense
              </Button>
            }
          >
            <Space direction="vertical" size={12} align="center">
              <RangePicker onChange={handleSetStartEndDate} />
              <Table
                columns={ExpensesColumn({
                  categories: categoriesData?.categories || [],
                  handleUpdateExpense,
                  handleRemoveExpense,
                })}
                rowKey="id"
                scroll={{ x: "max-content" }}
                dataSource={data?.expenses || []}
                loading={loading || categoriesLoading}
              />
            </Space>
          </Card>
        </div>

        <div className="flex justify-center">
          <Card title="Summary of Expense">
            <Space direction="vertical" size={12} align="center">
              <RangePicker onChange={handleSetReportStartEndDate} />
              <Table
                columns={ExpensesSumaryColumn()}
                rowKey="id"
                scroll={{ x: "max-content" }}
                dataSource={reportData?.expensesReport || []}
                loading={reportLoading}
              />
            </Space>
          </Card>
        </div>
      </div>
    </div>
  );
}
