import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Row,
  Col,
  FormText,
  FormFeedback,
  Label,
  FormGroup,
  Form,
  Button,
  Input,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  updateUserDataInDb,
  setStateProperty,
} from "../../Redux/EcomActions";
import orderPlaced from "../Images/orderPlaced.jpg";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({ disableButton }) => {
  const subTotal = useSelector((state) => state.subTotal);
  const roundOff = (floatNum) => parseFloat(floatNum.toFixed(2));
  const tax = roundOff(0.18 * subTotal);
  const [validation, setValidation] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingCharges, setShippingCharges] = useState(0);
  const [cartTotal, setcartTotal] = useState(0);
  const cartData = useSelector((state) => state.cartData);
  const dispatch = useDispatch();
  const isAddressAdded = useSelector((state) => state.isAddressAdded);
  const navigate = useNavigate();

  const updateCartTotal = () => {
    const newCartTotal = isAddressAdded
      ? subTotal + shippingCharges + tax - discountAmount
      : subTotal + tax - discountAmount;
    if (newCartTotal !== cartTotal) {
      setcartTotal(roundOff(newCartTotal));
    }
  };

  useEffect(() => {
    if (isAddressAdded) {
      setShippingCharges(roundOff(0.1 * subTotal));
    } else {
      setShippingCharges("TBD");
    }
    updateCartTotal();
  }, [isAddressAdded, discountAmount, shippingCharges, subTotal]);

  const calculateDiscount = (e) => {
    e.preventDefault();
    switch (discountCode) {
      case "DIS10": {
        setDiscountAmount(roundOff(0.1 * subTotal));
        setValidation("Success");
        break;
      }
      case "DIS20": {
        setDiscountAmount(roundOff(0.2 * subTotal));
        setValidation("Success");
        break;
      }
      case "DIS50": {
        setDiscountAmount(roundOff(0.5 * subTotal));
        setValidation("Success");
        break;
      }
      default: {
        setDiscountAmount(0);
        setValidation("Unsuccessful");
      }
    }
  };

  const handleCheckout = () => {
    dispatch(updateUserDataInDb("cartItems", []));
    dispatch(updateUserDataInDb("orderedItems", cartData));
    dispatch(updateUserDataInDb("finalBillAmount", cartTotal));

    Swal.fire({
      toast: true,
      title: "Your Order has been received!! ",
      text: "Thanks for your purchase!",
      imageUrl: orderPlaced,
      imageWidth: 300,
      imageHeight: 280,
      imageAlt: "Image",
      confirmButtonText: "Continue Shopping",
      customClass: {
        title: "swal2-center-text",
        htmlContainer: "swal2-center-text",
        actions: "swal2-center-actions",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(clearCart());
        navigate("/");
        dispatch(setStateProperty("cartComponentName", "CartPage"));
      }
    });
  };

  const amountData = [
    {
      heading: "Cart Subtotal:",
      value: `$${subTotal}`,
      margin: "m-0", // beacuse p has by defualt bottom margin
    },
    {
      heading: "Discount:",
      value: `-$${discountAmount}`,
      textColor: "text-light",
      margin: "m-0",
    },
    {
      heading: "Shipping:",
      value:
        shippingCharges === "TBD" ? shippingCharges : `+$${shippingCharges}`,
      margin: "m-0",
    },
    {
      heading: "Tax(18%):",
      value: `+$${tax}`,
      margin: "m-0",
    },
    {
      heading: "Cart Total:",
      value: `$${cartTotal}`,
      fontSize: "fs-4",
      alignItem: "align-items-center",
      margin: "",
    },
  ];

  return (
    <>
      <Row>
        <Col xs="12">
          <div className=" AddShadow rounded-4 my-3 p-3 ">
            {" "}
            <Form onSubmit={(e) => calculateDiscount(e)}>
              <FormGroup>
                <Label>
                  <h3>Coupon Code</h3>
                </Label>
                <Input
                  className="rounded-pill"
                  value={discountCode}
                  disabled={validation === "Success"}
                  valid={validation === "Success"}
                  invalid={validation === "Unsuccessful"}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
                <FormText className="text-muted">
                  Use the codes 'DIS10', 'DIS20', and 'DIS50' to receive a 10%,
                  20%, and 50% discount respectively
                </FormText>
                <FormFeedback>Invalid Code</FormFeedback>
                <FormFeedback valid>
                  {discountCode} Applied
                  <Button
                    color="link"
                    onClick={() => {
                      setValidation(false);
                    }}
                    size="sm"
                  >
                    Edit Coupon Code
                  </Button>
                </FormFeedback>
              </FormGroup>
              <Button className="bg-dark rounded-pill" block>
                Apply
              </Button>
            </Form>
          </div>
        </Col>
        <Col xs="12">
          <div className="AmountCalculationDiv rounded-4 p-3  ">
            <h3>Cart Total</h3>
            {amountData.map((item, index) => (
              <p
                key={index}
                className={`d-flex justify-content-between ${item?.margin} ${item?.alignItem} `}
              >
                {item.heading}{" "}
                <strong className={`${item?.textColor} ${item?.fontSize}`}>
                  {item.value}
                </strong>{" "}
              </p>
            ))}
            <Button
              disabled={disableButton}
              onClick={handleCheckout}
              className="bg-light text-dark rounded-pill"
              block
            >
              Place Order
            </Button>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default OrderSummary;
