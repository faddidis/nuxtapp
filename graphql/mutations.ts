import gql from 'graphql-tag';

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $customerNote: String
    $billing: CustomerAddressInput!
    $lineItems: [LineItemInput]!
  ) {
    createOrder(
      input: {
        customerNote: $customerNote
        billing: $billing
        lineItems: $lineItems
      }
    ) {
      order {
        id
        orderNumber
        status
        total
      }
      clientMutationId
    }
  }
`;

export interface CustomerAddressInput {
  firstName: string;
  email: string;
  phone: string;
  address1: string;
}

export interface LineItemInput {
  productId: number;
  quantity: number;
} 