import React from "react";
import Strapi from "strapi-sdk-javascript/build/main";
import { Box, Heading, Text, Image, Card, Button } from "gestalt";
const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

class Perfumes extends React.Component {
  state = {
    perfumes: [],
    brand: ""
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
        brand: response.data.brand.name
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const { brand, perfumes } = this.state;

    return (
      <Box
        marginTop={4}
        display="flex"
        justifyContent="center"
        alignItems="start"
      >
        {/* Perfumes Section */}
        <Box display="flex" direction="column" alignItems="center">
          {/* Perfumes Heading */}
          <Box margin={2}>
            <Heading color="orchid">{brand}</Heading>
          </Box>
          {/* Perfumes */}
          <Box
            dangerouslySetInlineStyle={{
              __style: {
                backgroundColor: "#bdcdd9"
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
                        <Button color="blue" text="Add to Cart" />
                      </Text>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
}

export default Perfumes;
