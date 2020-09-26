import { useState, useEffect } from "react";
import axios from "axios";

function ProductsAPI() {
  const [products, setProducts] = useState([]);

  const getProducs = async () => {
    const res = await axios.get("/api/products");
    setProducts(res.data.products);
  };

  useEffect(() => {
    getProducs();
  }, []);
  //returns products & then Globalstate import & add to to its state.
  return {
    products: [products, setProducts],
  };
}

export default ProductsAPI;
