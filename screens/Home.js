import React, { useCallback, useState } from "react";
import { FlatList, Image, Text, View, TouchableOpacity } from "react-native";
import MainLayout from "./Mainlayout";
import { connect } from "react-redux";
import { getHoldings, getCoinMarket } from "../stores/market/marketAction";
import dummyData from "../constants/dummy";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, SIZES, icons, FONTS } from "constants";
import BalanceInfo from "components/BalanceInfo";
import IconTextButton from "components/IconTextButton";
import { LineChart } from "react-native-chart-kit";

const Home = ({ getCoinMarket, getHoldings, myHoldings, coins }) => {
  const [selectedIndex, setSelectionIndex] = useState(0);
  useFocusEffect(
    useCallback(() => {
      getHoldings(dummyData.holdings);
      getCoinMarket();
    }, [])
  );
  let totalWallet = myHoldings?.reduce((a, b) => a + (b.total || 0), 0);

  let valueChange = myHoldings?.reduce(
    (a, b) => a + (b.holding_value_change_7d || 0),
    0
  );

  let percChange = (valueChange / (totalWallet - valueChange)) * 100;

  const renderWalletInfoSection = () => {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: COLORS.gray,
        }}
      >
        <BalanceInfo
          title="Your Wallet"
          displayAmount={totalWallet}
          changePct={percChange}
          containerStyle={{ marginTop: 50 }}
        />

        <View
          style={{
            flexDirection: "row",
            marginTop: 30,
            marginBottom: -15,
            paddingHorizontal: SIZES.radius,
          }}
        >
          <IconTextButton
            label="Transfer"
            icon={icons.send}
            containerStyle={{ flex: 1, height: 40, marginRight: SIZES.radius }}
            onPress={() => {}}
          />
          <IconTextButton
            label="Withdraw"
            icon={icons.withdraw}
            containerStyle={{ flex: 1, height: 40 }}
            onPress={() => {}}
          />
        </View>
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
        {renderWalletInfoSection()}

        {coins?.length > 0 && (
          <>
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
                    data: coins?.[selectedIndex]?.sparkline_in_7d?.price,
                  },
                ],
              }}
              width={360}
              height={160}
              chartConfig={{
                color: () => (percChange > 0 ? "green" : "red"),
              }}
              bezier
              style={{
                marginTop: 15,
                paddingRight: 0,
              }}
            />
            <FlatList
              data={coins}
              keyExtractor={(item) => item.id}
              ListHeaderComponentStyle={{
                marginTop: SIZES.padding,
                paddingHorizontal: 20,
              }}
              ListHeaderComponent={
                <View>
                  <Text style={{ ...FONTS.h2, color: COLORS.white }}>
                    Top Cryptocurrency
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: SIZES.radius,
                    }}
                  >
                    <Text style={{ flex: 1, color: COLORS.lightGray3 }}>
                      Asset
                    </Text>
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
                        {item?.name}
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
                          {item.price_change_percentage_7d_in_currency.toFixed(
                            2
                          )}{" "}
                          %
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </>
        )}
      </View>
    </MainLayout>
  );
};

function mapStateToProps(state) {
  return {
    myHoldings: state.marketReducer.myHoldings,
    coins: state.marketReducer.coins,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getHoldings: (...args) => {
      return dispatch(getHoldings(...args));
    },
    getCoinMarket: (...args) => {
      return dispatch(getCoinMarket(...args));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
