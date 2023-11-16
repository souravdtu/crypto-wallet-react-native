import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import MainLayout from "screens/Mainlayout";
import { COLORS, SIZES, FONTS, dummyData, icons } from "constants";
import { useFocusEffect } from "@react-navigation/native";
import { connect } from "react-redux";
import { BalanceInfo } from "components";
import { getHoldings } from "stores/market/marketAction";
import { LineChart } from "react-native-chart-kit";

const Portfolio = ({ getHoldings, myHoldings }) => {
  const [selectedIndex, setSelectionIndex] = useState(0);
  // useFocusEffect(
  //   useCallback(() => {
  //     getHoldings(dummyData.holdings);
  //   }, [])
  // );
  let totalWallet = myHoldings?.reduce((a, b) => a + (b.total || 0), 0);
  let valueChange = myHoldings?.reduce(
    (a, b) => a + (b.holding_value_change_7d || 0),
    0
  );
  let percChange = (valueChange / (totalWallet - valueChange)) * 100;

  const renderCurrentBalanceSection = () => {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: COLORS.gray,
        }}
      >
        <Text
          style={{ marginTop: 50, color: COLORS.white, ...FONTS.largeTitle }}
        >
          Portfolio
        </Text>

        <BalanceInfo
          title="Current Balance"
          displayAmount={totalWallet}
          changePct={percChange}
          containerStyle={{
            marginTop: SIZES.radius,
            marginBottom: SIZES.padding,
          }}
        />
      </View>
    );
  };

  return (
    <MainLayout>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.black,
        }}
      >
        {renderCurrentBalanceSection()}

        {myHoldings?.length > 0 && (
          <LineChart
            withVerticalLabels={false}
            withHorizontalLabels={false}
            withDots={false}
            withInnerLines={false}
            withVerticalLines={false}
            withOuterLines={false}
            withShadow={false}
            data={{
              datasets: [
                {
                  data: myHoldings[selectedIndex]?.sparkline_in_7d?.value,
                },
              ],
            }}
            width={360}
            height={160}
            chartConfig={{
              color: () => (percChange > 0 ? "green" : "red"),
            }}
            bezier
            style={{ paddingRight: 0 }}
          />
        )}

        <FlatList
          data={myHoldings}
          keyExtractor={(item) => item.id}
          ListHeaderComponentStyle={{
            marginTop: SIZES.padding,
            paddingHorizontal: 20,
          }}
          ListHeaderComponent={
            <View>
              <Text style={{ ...FONTS.h2, color: COLORS.white }}>
                Your Assets
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: SIZES.radius,
                }}
              >
                <Text style={{ flex: 1, color: COLORS.lightGray3 }}>Asset</Text>
                <Text
                  style={{
                    flex: 1,
                    color: COLORS.lightGray3,
                    textAlign: "right",
                  }}
                >
                  Price
                </Text>
                <Text
                  style={{
                    flex: 1,
                    color: COLORS.lightGray3,
                    textAlign: "right",
                  }}
                >
                  Holdings
                </Text>
              </View>
            </View>
          }
          renderItem={({ item, index }) => {
            let priceColor =
              item.price_change_percentage_7d_in_currency == 0
                ? COLORS.lightGray3
                : item.price_change_percentage_7d_in_currency > 0
                ? COLORS.lightGreen
                : COLORS.red;
            return (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  // height: 55,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  marginTop: 10,
                  backgroundColor:
                    selectedIndex == index ? COLORS.gray : "black",
                  borderRadius: 20,
                }}
                onPress={() => setSelectionIndex(index)}
                activeOpacity={1}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={{ width: 20, height: 20 }}
                  />

                  <Text
                    style={{
                      marginLeft: SIZES.radius,
                      color: COLORS.white,
                      ...FONTS.h4,
                    }}
                  >
                    {item.name}
                  </Text>
                </View>

                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text
                    style={{
                      textAlign: "right",
                      color: COLORS.white,
                      ...FONTS.h4,
                      lineHeight: 15,
                    }}
                  >
                    {"\u20B9"} {item.current_price.toLocaleString("en-IN")}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {item.price_change_percentage_7d_in_currency != 0 && (
                      <Image
                        source={icons.upArrow}
                        style={{
                          height: 10,
                          width: 10,
                          tintColor: priceColor,
                          transform:
                            item.price_change_percentage_7d_in_currency > 0
                              ? [{ rotate: "45deg" }]
                              : [{ rotate: "125deg" }],
                        }}
                      />
                    )}

                    <Text
                      style={{
                        marginLeft: 5,
                        color: priceColor,
                        ...FONTS.body5,
                        lineHeight: 15,
                      }}
                    >
                      {item.price_change_percentage_7d_in_currency.toFixed(2)} %
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "right",
                      color: COLORS.white,
                      ...FONTS.h4,
                      lineHeight: 15,
                    }}
                  >
                    {"\u20B9"} {item.total.toLocaleString("en-IN")}
                  </Text>

                  <Text
                    style={{
                      textAlign: "right",
                      color: COLORS.lightGray3,
                      ...FONTS.body5,
                      lineHeight: 15,
                    }}
                  >
                    {item.qty} {item.symbol.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </MainLayout>
  );
};

function mapStateToProps(state) {
  return {
    myHoldings: state.marketReducer.myHoldings,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getHoldings: (...args) => {
      return dispatch(getHoldings(...args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
