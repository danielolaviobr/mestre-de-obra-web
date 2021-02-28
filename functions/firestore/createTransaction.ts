import { firestore } from "@firebase";
import AppError from "utils/AppError";

interface CreateCheckoutSessionProps {
  uid: string;
  productName: string;
}

export default async function createTransaction({
  uid,
  productName,
}: CreateCheckoutSessionProps) {
  const products = await firestore
    .collection("products")
    .where("name", "==", productName)
    .where("active", "==", true)
    .get();

  if (products.empty) {
    throw new AppError("product/not-found");
  }

  const product = products.docs[0];

  const prices = await firestore
    .collection("products")
    .doc(product.id)
    .collection("prices")
    .where("active", "==", true)
    .get();

  if (prices.empty) {
    throw new AppError("product/no-prices-found");
  }

  const price = prices.docs[0];

  const transaction = await firestore
    .collection("users")
    .doc(uid)
    .collection("checkout_sessions")
    .add({
      price: price.id,
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/upload`, // TODO change to onboarding like
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/subscription`,
      allow_promotion_codes: true,
      locale: "pt-BR",
    });

  return transaction;
}
