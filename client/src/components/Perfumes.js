import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
// prettier-ignore
import { Box, Heading, Text, Image, Card, Button, Mask, IconButton } from "gestalt";
import { calculatePrice, setCart, getCart } from "../utils";
import { Link } from "react-router-dom";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Perfumes extends React.Component {
  state = {
    perfumes: [],
    brand: "",
    cartItems: []
  };

  async componentDidMount() {
    try {
      const response = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
          brand(id: "${this.props.match.params.brandId}") {
            _id
            name
            perfumes {
              _id
              name
              description
              image {
                url
              }
              price
            }
          }
        }`
        }
      });
      this.setState({
        perfumes: response.data.brand.perfumes,
        brand: response.data.brand.name,
        cartItems: getCart()
      });
    } catch (err) {
      console.error(err);
    }
  }

  addToCart = perfume => {
    const alreadyInCart = this.state.cartItems.findIndex(
      item => item._id === perfume._id
    );

    if (alreadyInCart === -1) {
      const updatedItems = this.state.cartItems.concat({
        ...perfume,
        quantity: 1
      });
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    } else {
      const updatedItems = [...this.state.cartItems];
      updatedItems[alreadyInCart].quantity += 1;
      this.setState({ cartItems: updatedItems }, () => setCart(updatedItems));
    }
  };

  deleteItemFromCart = itemToDeleteId => {
    const filteredItems = this.state.cartItems.filter(
      item => item._id !== itemToDeleteId
    );
    this.setState({ cartItems: filteredItems }, () => setCart(filteredItems));
  };

  render() {
    const { brand, perfumes, cartItems } = this.state;

    return (
      <Box
        marginTop={4}
        display="flex"
        justifyContent="center"
        alignItems="start"
        dangerouslySetInlineStyle={{
          __style: {
            flexWrap: "wrap-reverse"
          }
        }}
      >
        {/* Perfumes Section */}
        <Box display="flex" direction="column" alignItems="center">
          {/* Perfumes Heading */}
          <Box margin={2}>
            <Heading color="black">{brand}</Heading>
          </Box>
          {/* Perfumes */}
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: "#fff"
              }
            }}
            wrap
            shape="rounded"
            display="flex"
            justifyContent="center"
            padding={4}
          >
            {perfumes.map(perfume => (
              <Box paddingY={4} margin={2} width={210} key={perfume._id}>
                <Card
                  image={
                    <Box height={250} width={200}>
                      <Image
                        fit="cover"
                        alt="Brand"
                        naturalHeight={1}
                        naturalWidth={1}
                        src={`${apiUrl}${perfume.image.url}`}
                      />
                    </Box>
                  }
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    direction="column"
                  >
                    <Box marginBottom={2}>
                      <Text bold size="xl">
                        {perfume.name}
                      </Text>
                    </Box>
                    <Text>{perfume.description}</Text>
                    <Text color="orchid">${perfume.price}</Text>
                    <Box marginTop={2}>
                      <Text bold size="xl">
                        <Button
                          onClick={() => this.addToCart(perfume)}
                          color="blue"
                          text="Add to Cart"
                        />
                      </Text>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* User Cart */}
        <Box alignSelf="end" marginTop={2} marginLeft={8}>
          <Mask shape="rounded" wash>
            <Box
              display="flex"
              direction="column"
              alignItems="center"
              padding={2}
            >
              {/* User Cart Heading */}
              <Heading align="center" size="sm">
                Your Cart
              </Heading>
              <Text color="gray" italic>
                {cartItems.length} items selected
              </Text>

              {/* Cart Items */}
              {cartItems.map(item => (
                <Box key={item._id} display="flex" alignItems="center">
                  <Text>
                    {item.name} x {item.quantity} - $
                    {(item.quantity * item.price).toFixed(2)}
                  </Text>
                  <IconButton
                    accessibilityLabel="Delete Item"
                    icon="cancel"
                    size="sm"
                    iconColor="red"
                    onClick={() => this.deleteItemFromCart(item._id)}
                  />
                </Box>
              ))}

              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Box margin={2}>
                  {cartItems.length === 0 && (
                    <Text color="red">Please select some items</Text>
                  )}
                </Box>
                <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                <Text>
                  <Link to="/checkout">Checkout</Link>
                </Text>
              </Box>
            </Box>
          </Mask>
        </Box>
      </Box>
    );
  }
}

export default Perfumes;
