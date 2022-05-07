//imports
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  Text,
  SafeAreaView,
  Dimensions,
  Image,
  ScrollView,
  RefreshControl,
  View,
} from "react-native";

//app
const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [refreshing, setRefreshing] = useState(false);

  //useEffect
  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=false"
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  //values positive or negative in 24 hours
  const value24H = (price_change_percentage_24h) => {
    if (price_change_percentage_24h > 0) {
      return styles.textGreen;
    } else {
      return styles.textRed;
    }
  };

  //refresh
  const pullMe = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  //styles
  const deviceWidth = Math.round(Dimensions.get("window").width);
  const styles = StyleSheet.create({
    cardContainer: {
      width: deviceWidth,
      backgroundColor: "#EBF6FF",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: 100,
      flexDirection: "column",
      borderRadius: 15,
      borderWidth: 1,
      borderColor: "#063382",
      padding: 5,
    },
    textContainer: {
      alignContent: "center",
    },
    textRed: {
      color: "#FF0000",
    },
    textGreen: {
      color: "#1EC126",
    },
    tinyLogo: {
      alignContent: "center",
    },
    scrollView: {
      flex: 1,
      backgroundColor: "pink",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  //return
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={pullMe} />
        }
      >
        <View>
          {isLoading ? (
            <Text>Loading...</Text>
          ) : (
            <FlatList
              data={data}
              keyExtractor={({ id }, index) => id}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <Text style={styles.textContainer}>
                    {"Nombre del coin: " + item.name}
                  </Text>
                  <Text style={styles.textContainer}>
                    {" Precio actual: $" + item.current_price}
                  </Text>
                  <Text style={value24H(item.price_change_percentage_24h)}>
                    {" Cambio de precio en las últimas 24h: " +
                      item.price_change_percentage_24h +
                      "%"}
                  </Text>
                  <Text style={styles.textContainer}>
                    {"Suminstro Máximo: " + item.max_supply}
                  </Text>
                  <Image
                    style={{ width: 35, height: 35 }}
                    source={{
                      uri: item.image,
                    }}
                  />
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
