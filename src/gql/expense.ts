import { gql } from "@apollo/react-hooks";

export const ExpensesQuery = gql`
  query Expenses($input: ExpensesInput!) {
    expenses(input: $input) {
      id
      title
      amount
      date
      categoryId
      category {
        id
        name
      }
      notes
      userId
    }
  }
`;

export const CategoriesQuery = gql`
  query Categories($input: CategoriesInput) {
    categories(input: $input) {
      id
      name
    }
  }
`;

export const UpdateExpenseMutation = gql`
  mutation UpdateExpense($input: UpdateExpenseInput!) {
    updateExpense(input: $input) {
      title
      amount
      date
      category {
        id
        name
      }
      notes
      userId
    }
  }
`;

export const CreateExpenseMutation = gql`
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
      title
      amount
      date
      category {
        name
        id
      }
      notes
      userId
    }
  }
`;

export const RemoveExpenseMutation = gql`
  mutation RemoveExpense($id: ID!) {
    removeExpense(id: $id) {
      title
      amount
      date
      category {
        name
      }
      notes
      userId
    }
  }
`;
