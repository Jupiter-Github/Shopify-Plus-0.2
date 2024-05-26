import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import { Container, Row, Spinner } from "reactstrap";

const CartMain = React.lazy(() => import("./Cart/CartMain"));
const ProductDetail = React.lazy(() => import("./ProductDetail"));
const Home = React.lazy(() => import("./Home"));

const Main = () => {
  return (
    <>
      <NavBar />
      <Suspense
        fallback={
          <Container fluid>
            <Row className="justify-content-center">
              <Spinner color="primary"></Spinner>
            </Row>
          </Container>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ProductDetail/:productId" element={<ProductDetail />} />
          <Route path="/CartMain" element={<CartMain />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default Main;
