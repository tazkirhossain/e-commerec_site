/**
 * Payment methods offered at checkout (FR-PAY-01).
 *
 * `markColor` is each provider's own brand colour. It is content, not a design
 * value — it belongs to bKash and Nagad, not to our token set — which is why
 * it lives here rather than in `globals.css`.
 *
 * Which methods are enabled, and their minimum and maximum order amounts, are
 * settings in the real platform (FR-ADM-05).
 */

export interface PaymentMethod {
  id: string;
  /** Short mark shown in the logo plate, e.g. "bKash", "EMI", "COD". */
  mark: string;
  name: string;
  note: string;
  markColor: string;
  /** Orders above this cannot use the method; `undefined` means no cap. */
  maximumOrder?: number;
  disabled?: boolean;
  disabledReason?: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: "bkash",
    mark: "bKash",
    name: "bKash",
    note: "Pay with your bKash wallet",
    markColor: "#e2136e",
  },
  {
    id: "nagad",
    mark: "Nagad",
    name: "Nagad",
    note: "Pay with your Nagad wallet",
    markColor: "#ec1c24",
  },
  {
    id: "card",
    mark: "CARD",
    name: "Debit or credit card",
    note: "Entered on your bank's own page",
    markColor: "#1f3a5f",
  },
  {
    id: "emi",
    mark: "EMI",
    name: "Bank EMI",
    note: "0% for up to 24 months on partner cards",
    markColor: "#2b6b4f",
  },
  {
    id: "cod",
    mark: "COD",
    name: "Cash on delivery",
    note: "Available up to ৳ 50,000",
    markColor: "#3f3f3f",
    maximumOrder: 50000,
  },
];
