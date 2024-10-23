"use client";

import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Button, Card, Modal, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  CategoriesQuery,
  CreateExpenseMutation,
  ExpensesQuery,
  RemoveExpenseMutation,
  UpdateExpenseMutation,
} from "../../gql";
import {
  Expense,
  ExpensesInput,
  CategoriesInput,
  Category,
} from "../../type/expense";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import ExpenseEditor from "../../components/expense/editor";
import { alertError, alertSuccess } from "../../components/common/alert";
import moment from "moment";
import { assert } from "console";
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
              onCancel() {
                console.log("Cancel");
              },
            });
          }}
        >
          Delete
        </Button>
      </>
    ),
  },
];
export default function ExpensePage() {
  const [expenses, { data: data, loading }] = useLazyQuery<
    ExpenseRes,
    ExpensesReq
  >(ExpensesQuery, {
    onCompleted(data) {
      console.log({ data });
    },
    onError(error) {
      alertError(error.message, "Get Expenses Failed");
    },
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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

  const userId = localStorage.getItem("userId") ?? "";

  const handleSetStartEndDate = (val: any) => {
    setStartDate(val[0]);
    setEndDate(val[1]);
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
    <div className="w-full flex justify-center">
      <div className="">
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
              dataSource={data?.expenses || []}
              loading={loading || categoriesLoading}
            />
          </Space>
        </Card>
      </div>
    </div>
  );
}
