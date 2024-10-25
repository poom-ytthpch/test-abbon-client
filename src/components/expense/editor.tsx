import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import { Category, Expense } from "../../type/expense";
import { useEffect } from "react";
import moment from "moment";

type Props = {
  categories: Category[];
  expense?: Expense;
  update: boolean;
  handleUpdateExpense: (val: Expense) => void;
};

export default function ExpenseEditor({
  update,
  expense,
  categories,
  handleUpdateExpense,
}: Props) {
  const [form] = Form.useForm<Expense>();

  useEffect(() => {
    if (expense) {
      form.setFieldsValue({
        ...expense,
        categoryId: expense?.category?.id,
        date: moment(expense.date),
      });
    }
  }, [expense]);

  return (
    <div className="w-full">
      <Form form={form} onFinish={handleUpdateExpense}>
        {update && (
          <Form.Item
            name="id"
            label="Id"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
          >
            <Input name="id" type="text" disabled />
          </Form.Item>
        )}

        <Form.Item
          name="title"
          label="Title"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          <Input name="title" type="text" />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          <Input name="amount" type="number" />
        </Form.Item>
        <Form.Item
          name="date"
          label="Date"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          <DatePicker name="date" showTime />
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Category"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          <Select
            options={categories.map((ct) => ({
              label: ct.name,
              value: ct.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="notes"
          label="Notes"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
        >
          <Input name="title" type="text" />
        </Form.Item>

        {update ? (
          <div className="w-full ml-24">
            <Space align="end">
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Space>
          </div>
        ) : (
          <div className="w-full ml-24">
            <Space align="end">
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Space>
          </div>
        )}
      </Form>
    </div>
  );
}
