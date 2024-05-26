import React from "react";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { useSelector } from "react-redux";

const CartBreadCrumb = () => {
  const cartComponent = useSelector((state) => state.cartComponentName);

  return (
    <Breadcrumb>
      <BreadcrumbItem active={cartComponent === "CartPage"}>
        Cart
      </BreadcrumbItem>
      <BreadcrumbItem active={cartComponent === "AddressPage"}>
        Add Address
      </BreadcrumbItem>
      <BreadcrumbItem active={cartComponent === "PaymentPage"}>
        Add Card Details
      </BreadcrumbItem>
      <BreadcrumbItem active={cartComponent === "ReviewOrder"}>
        Review Order
      </BreadcrumbItem>
    </Breadcrumb>
  );
};

export default CartBreadCrumb;
