import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductDetail } from "../Redux/EcomActions";
import { Rating } from "@mui/material";
import { Button, Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart, incrementCartItem } from "../Redux/EcomActions";


const ProductDetail = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const productDetail = useSelector((state) => state.productDetail);
  const cartData = useSelector((state) => state.cartData);
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const Navigate = useNavigate();
  const { id, title, price, category, description, rating, image } =
    productDetail;

  useEffect(() => {
    dispatch(fetchProductDetail(productId));
  }, [dispatch, productId]);


  const handleAddToCart = () => {
    if (isLoggedIn) {
      Navigate("/CartMain");
      const existingItem = cartData.find((value) => value.id === id);
      if (existingItem) {
        dispatch(incrementCartItem(id));
      } else {
        dispatch(addToCart({ id, title, price, image, quantity: 1 }));
      }
    } else {
      toast.warning("Login First");
    }
  };

  return (
    <>
      {Object.keys(productDetail).length && (
        <Container fluid className=" mt-5">
          <Row className="customRow">
            <Col xs="12" md="6" className="customColumn1">
              <div className="ProductImageDiv">
                <img src={productDetail.image} alt="Product " />
              </div>
            </Col>
            <Col xs="12" md="6" className="customColumn2">
              <div className="ProductDetailDiv">
                <h3>{title}</h3>
                <h6>{category}</h6>
                <div className="RatingDiv">
                  <Rating
                    className="d-flex align-items-center"
                    name="read-only"
                    size="small"
                    value={rating.rate}
                    precision={0.5}
                    readOnly
                  />
                  <small className="text-muted">({rating.count} Reviews)</small>
                </div>
                <h3>${price}</h3>
                <p>{description} </p>
                <Button
                  className="me-3"
                  onClick={handleAddToCart}
                  size="sm"
                  color="primary"
                >
                  Add to Cart
                </Button>
                <Button onClick={handleAddToCart} size="sm" color="primary">
                  Buy Now
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default ProductDetail;
