import type { ContentPage } from "./types";

/**
 * Static pages (FR-CMS-04). Rendered single column at a 680px measure, with a
 * table of contents on the long policies (DS-PG-CONTENT).
 */
export const contentPages: ContentPage[] = [
  {
    slug: "about-us",
    title: "About Voltra",
    intro:
      "Voltra is an authorized reseller of premium gadgets in Bangladesh. We opened our first store in Gulshan in 2019 and now run eight outlets alongside this site.",
    updated: "2026-10-01",
    sections: [
      {
        heading: "What we sell",
        body: [
          "Phones, laptops, tablets, wearables, audio, gaming, networking and the accessories that go with them. Everything we list is official Bangladesh stock, bought through the brand or its appointed distributor.",
          "That matters for two reasons: the warranty is honoured by the brand's own service centres, and the hardware is the regional model, so cellular bands and chargers match what is used here.",
        ],
      },
      {
        heading: "How we price",
        body: [
          "We publish one price, including VAT. Where a brand runs a campaign we pass the campaign price through and show what the saving is against the regular price.",
          "EMI is offered at 0% on most products through partner banks, which means the monthly figure you see is the price divided by the tenure, with no interest added.",
        ],
      },
      {
        heading: "Service after the sale",
        body: [
          "Three of our stores have a service desk that handles warranty claims directly, so a repair does not need to go through a third party. For products we do not service in-house we book the claim with the brand's centre and track it on your behalf.",
        ],
      },
    ],
  },
  {
    slug: "contact-us",
    title: "Contact us",
    intro:
      "Call, message or visit a store. We answer calls from 10:00 am to 9:00 pm, seven days a week.",
    updated: "2026-10-01",
    sections: [
      {
        heading: "Customer support",
        body: [
          "Phone: 01700-000100. Email: help@voltra.example. We reply to email within one working day.",
          "For an order already placed, quoting the order number gets you an answer fastest.",
        ],
      },
      {
        heading: "Corporate and bulk orders",
        body: [
          "For orders of ten units or more, email corporate@voltra.example with the quantity and configuration. We quote within two working days and can invoice against a purchase order.",
        ],
      },
      {
        heading: "Press",
        body: ["Email press@voltra.example."],
      },
    ],
  },
  {
    slug: "emi-and-payments",
    title: "EMI and payments",
    intro:
      "You can pay with cash on delivery, bKash, Nagad, a debit or credit card, or bank EMI. Card details are entered on the bank's own page, never on ours.",
    updated: "2026-10-20",
    sections: [
      {
        heading: "How 0% EMI works",
        body: [
          "On a 0% plan the price is divided by the number of months and no interest is added. A ৳ 1,64,999 phone over 12 months is ৳ 13,750 a month.",
          "Your bank may charge a processing fee on top. We show the total payable, the interest and any fee before you reach the payment page, so there is nothing to discover afterwards.",
        ],
      },
      {
        heading: "Eligible cards",
        body: [
          "0% EMI is available on credit cards from City Bank, BRAC Bank, EBL and twelve other partner banks. Tenures of 3, 6, 9, 12 and 24 months are offered, depending on the bank and the order value.",
          "Debit cards cannot be used for EMI. The minimum order value for an EMI plan is ৳ 10,000.",
        ],
      },
      {
        heading: "Cash on delivery",
        body: [
          "Available nationwide up to ৳ 50,000. We verify the phone number with a one-time code before confirming a cash-on-delivery order, and orders above the threshold get a confirmation call.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Refunds go back to the method you paid with. Wallet and card refunds take three to seven working days depending on the provider; cash-on-delivery refunds are paid by bank transfer or mobile wallet.",
        ],
      },
    ],
  },
  {
    slug: "delivery-policy",
    title: "Delivery policy",
    intro:
      "We deliver nationwide. Inside Dhaka most orders arrive the next day; outside Dhaka it is two to four days.",
    updated: "2026-10-20",
    sections: [
      {
        heading: "Fees",
        body: [
          "Delivery is free inside Dhaka on orders over ৳ 5,000, and ৳ 80 below that. Outside Dhaka it is ৳ 150, free over ৳ 20,000.",
          "Store pickup is always free and is usually ready within two hours during opening times.",
        ],
      },
      {
        heading: "Timing",
        body: [
          "Orders placed before 4:00 pm are dispatched the same day. We do not deliver on government holidays, and the courier may be slower during Eid.",
          "You get an SMS when the order is dispatched, with the courier's tracking number.",
        ],
      },
      {
        heading: "Checking the parcel",
        body: [
          "Open the parcel in front of the delivery person and check the box seal before paying. If the seal is broken or the item is wrong, refuse the delivery and call us — that is far simpler than a return.",
        ],
      },
    ],
  },
  {
    slug: "return-policy",
    title: "Return policy",
    intro:
      "You can return most products within seven days of delivery if they are unused and in the original packaging. Some categories are excluded.",
    updated: "2026-10-20",
    sections: [
      {
        heading: "What can be returned",
        body: [
          "Anything that arrives damaged, faulty or not as described can be returned or exchanged, and we cover the courier cost both ways.",
          "A change of mind is accepted within seven days on most products, provided the item is unused, complete and in its original sealed packaging. The return courier cost is yours in that case.",
        ],
      },
      {
        heading: "What cannot be returned",
        body: [
          "Opened software, prepaid cards and digital codes. Earphones and in-ear products once the seal is broken, for hygiene reasons. Screen protectors once applied.",
          "Products with physical damage, liquid damage or a missing serial sticker are out of policy and move to a warranty assessment instead.",
        ],
      },
      {
        heading: "How to start a return",
        body: [
          "Open the order in your account and choose Request a return, or call 01700-000100 with the order number. We approve or reject within two working days and arrange the pickup.",
          "Refunds are issued once the item reaches us and passes inspection, usually within three working days of arrival. Reward points earned on the order are reversed at the same time.",
        ],
      },
    ],
  },
  {
    slug: "warranty",
    title: "Warranty",
    intro:
      "Every product carries the brand's official warranty, honoured in Bangladesh. The period is printed on the product page and the invoice.",
    updated: "2026-10-20",
    sections: [
      {
        heading: "What is covered",
        body: [
          "Manufacturing defects and component failure under normal use. The standard period is one year for most products, two years for some laptops and three for ThinkPad models.",
          "Batteries and bundled accessories usually carry six months, which is the brand's term, not ours.",
        ],
      },
      {
        heading: "What voids it",
        body: [
          "Physical damage, liquid ingress, unauthorised repair, a removed or altered serial number, and software modification such as unlocking a bootloader.",
        ],
      },
      {
        heading: "Making a claim",
        body: [
          "Bring the product and the invoice to any Voltra store, or call us and we will book it in. We keep the serial number on your order, so a lost invoice is not a problem.",
          "Where we service in-house the typical turnaround is five to seven working days. Claims that go to the brand's centre take longer and we will tell you the estimate when the claim is booked.",
        ],
      },
    ],
  },
  {
    slug: "exchange",
    title: "Exchange your old device",
    intro:
      "Trade a working phone, tablet or laptop against a new one. We quote on condition, and the amount comes off the price at checkout.",
    updated: "2026-10-15",
    sections: [
      {
        heading: "How it works",
        body: [
          "Submit the model and condition on the product page or in store. We reply with a valuation, usually within a few hours during opening times.",
          "If you accept, the valuation is deducted from the new purchase. We check the device when we collect it, and the quote holds unless the condition is materially different from what was described.",
        ],
      },
      {
        heading: "What we accept",
        body: [
          "Phones, tablets and laptops that power on, hold a charge and have no account lock. The screen may be cracked — that affects the valuation, not the eligibility.",
          "We cannot accept devices that are locked to an account, reported stolen, or water damaged to the point of not booting.",
        ],
      },
      {
        heading: "Before you hand it over",
        body: [
          "Back up, sign out of your accounts, and factory reset the device. We wipe every device we take in, but signing out first is the only way to clear an activation lock.",
        ],
      },
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy policy",
    intro:
      "This policy explains what we collect, why, and what you can ask us to do with it. We collect as little as the order needs.",
    updated: "2026-10-20",
    sections: [
      {
        heading: "What we collect",
        body: [
          "To take an order we need a phone number and a delivery address. An email address is optional and is used for receipts and order notices.",
          "We never see or store card numbers. Card payments happen on the gateway's own page and we receive only the result and a reference.",
          "We keep a record of what you bought, so warranty claims can be looked up from the order, and basic analytics about how the site is used.",
        ],
      },
      {
        heading: "Marketing",
        body: [
          "We send marketing messages only if you opted in, and every message has an unsubscribe link. Order notices are not marketing and are sent regardless, because they are part of the service.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You can ask to see, correct, export or delete your data. Email privacy@voltra.example and we complete the request within thirty days.",
          "Deletion does not remove order and invoice records we are required to keep for tax purposes. Those are retained for the statutory period and nothing else.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "Essential cookies keep you signed in and hold your cart. Analytics cookies are set only if you accept them, and declining is one click, the same as accepting.",
        ],
      },
    ],
  },
  {
    slug: "terms-of-use",
    title: "Terms of use",
    intro:
      "These terms cover your use of this site and any order placed through it.",
    updated: "2026-10-20",
    sections: [
      {
        heading: "Orders",
        body: [
          "An order is an offer to buy. The contract forms when we confirm the order, not when you place it, which lets us decline where stock or pricing turned out to be wrong.",
          "If we have published a clearly incorrect price we will contact you before dispatch and you can confirm at the corrected price or cancel for a full refund.",
        ],
      },
      {
        heading: "Pricing and availability",
        body: [
          "Prices include VAT and are in Bangladeshi taka. Stock shown on the site is checked again when you reach checkout, and a line that has become unavailable is flagged before you pay.",
        ],
      },
      {
        heading: "Content",
        body: [
          "Product photography and specifications come from the brands. Specifications can change between production runs; where a difference matters we go by the specification printed on the unit.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "Nothing in these terms limits your statutory consumer rights. Our liability for a product is limited to its purchase price and the warranty terms that come with it.",
        ],
      },
    ],
  },
  {
    slug: "help",
    title: "Help",
    intro:
      "Answers to what we are asked most. If none of this covers it, call 01700-000100.",
    updated: "2026-10-25",
    sections: [
      {
        heading: "Where is my order?",
        body: [
          "Open Track order and enter the order number with the phone number you used. You do not need an account.",
          "If the courier has it, the tracking number in that view links straight to their own tracking page.",
        ],
      },
      {
        heading: "Can I change the delivery address?",
        body: [
          "Yes, until the order is dispatched. Call us with the order number. Once the courier has collected it we can usually only redirect within the same city.",
        ],
      },
      {
        heading: "Is this product genuine?",
        body: [
          "Everything we sell is official Bangladesh stock with a brand warranty. The invoice carries the serial number, and the brand's own warranty check will show the unit as registered here.",
        ],
      },
      {
        heading: "Do you have it in a store?",
        body: [
          "The product page shows which stores hold the item when store pickup is available. Stock moves during the day, so for a single remaining unit it is worth calling the store first.",
        ],
      },
      {
        heading: "How do reward points work?",
        body: [
          "You earn points on orders that reach Delivered, and can redeem them against part of a later order at checkout. The balance and history are in your account.",
        ],
      },
    ],
  },
];

export function getContentPage(slug: string): ContentPage | undefined {
  return contentPages.find((p) => p.slug === slug);
}

/** Footer link groups (FR-CMS-05), matching the C4 navigation wireframe. */
export const footerGroups = [
  {
    heading: "Shop",
    links: [
      { label: "Phones", href: "/category/phones" },
      { label: "Laptops", href: "/category/laptops" },
      { label: "Audio", href: "/category/audio" },
      { label: "Gaming", href: "/category/gaming" },
      { label: "All brands", href: "/brand" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About us", href: "/pages/about-us" },
      { label: "Careers", href: "/pages/about-us" },
      { label: "Store locator", href: "/store-locator" },
      { label: "Corporate sales", href: "/pages/contact-us" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Track order", href: "/track-order" },
      { label: "EMI and payments", href: "/pages/emi-and-payments" },
      { label: "Exchange", href: "/pages/exchange" },
      { label: "Warranty", href: "/pages/warranty" },
      { label: "Contact us", href: "/pages/contact-us" },
    ],
  },
  {
    heading: "Policy",
    links: [
      { label: "Privacy policy", href: "/pages/privacy-policy" },
      { label: "Terms of use", href: "/pages/terms-of-use" },
      { label: "Return policy", href: "/pages/return-policy" },
      { label: "Delivery policy", href: "/pages/delivery-policy" },
    ],
  },
] as const;
