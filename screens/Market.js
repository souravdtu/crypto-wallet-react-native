import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import MainLayout from "screens/Mainlayout";
import { COLORS, SIZES, constants, FONTS, icons } from "constants";
import { connect } from "react-redux";
import { TouchableOpacity } from "react-native";
import TextButton from "components/TextButton";
import { getCoinMarket } from "stores/market/marketAction";
import { HeaderBar } from "components";
import { Animated } from "react-native";
import { useRef } from "react";
import { FlatList } from "react-native";
import { LineChart } from "react-native-chart-kit";

const marketTabs = constants.marketTabs.map((marketTab) => ({
  ...marketTab,
  ref: React.createRef(),
}));

const TabIndicator = ({ measureLayout, scrollX }) => {
  const inputRange = marketTabs.map((_, i) => i * SIZES.width);
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map((measure) => measure.x),
  });
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        height: "100%",
        width: (SIZES.width - SIZES.radius * 2) / 2,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.lightGray,
        transform: [
          {
            translateX,
          },
        ],
      }}
    ></Animated.View>
  );
};
const Tabs = ({ scrollX, onMarketTabPress }) => {
  const [measureLayout, setMeasureLayout] = useState([]);
  const containerRef = useRef();

  useEffect(() => {
    let ml = [];
    marketTabs.forEach((marketTab) => {
      marketTab?.ref?.current?.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          ml.push({ x, y, width, height });

          if (ml.length === marketTabs.length) {
            setMeasureLayout(ml);
          }
        }
      );
    });
  }, [containerRef.current]);
  return (
    <View ref={containerRef} style={{ flexDirection: "row" }}>
      {measureLayout.length > 0 && (
        <TabIndicator measureLayout={measureLayout} scrollX={scrollX} />
      )}
      {marketTabs?.map((item, index) => {
        return (
          <TouchableOpacity
            key={`MarketTab-${index}`}
            style={{ flex: 1 }}
            onPress={() => {
              onMarketTabPress(index);
            }}
          >
            <View
              ref={item.ref}
              style={{
                paddingHorizontal: 15,
                alignItems: "center",
                justifyContent: "center",
                height: 40,
              }}
            >
              <Text style={{ color: COLORS.white, ...FONTS.h3 }}>
                {item?.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Market = ({ getCoinMarket, coins }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const marketTabScrollViewRef = useRef();

  const onMarketTabPress = useCallback((marketTabIndex) => {
    marketTabScrollViewRef?.current?.scrollToOffset({
      offset: marketTabIndex * SIZES.width,
    });
  });
  useEffect(() => {
    getCoinMarket();
  }, []);

  const renderTabBar = () => {
    return (
      <View
        style={{
          marginTop: SIZES.radius,
          marginHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.gray,
        }}
      >
        <Tabs scrollX={scrollX} onMarketTabPress={onMarketTabPress} />
      </View>
    );
  };

  const renderButtons = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: SIZES.radius,
          marginHorizontal: SIZES.radius,
        }}
      >
        <TextButton label={"INR"} />
        <TextButton
          label={"% (1d)"}
          containStyle={{ marginLeft: SIZES.base }}
        />
        <TextButton label="Top" containStyle={{ marginLeft: SIZES.base }} />
      </View>
    );
  };

  const renderList = () => {
    return (
      <Animated.FlatList
        ref={marketTabScrollViewRef}
        data={marketTabs}
        contentContainerStyle={{
          marginTop: SIZES.padding,
        }}
        horizontal
        paddingEnabled
        scrollEventThrottle={16}
        snapToAlignment={"center"}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          }
        )}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                flex: 1,
                width: SIZES.width,
                borderWidth: 1,
              }}
            >
              <FlatList
                data={coins}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                  let priceColor =
                    item.price_change_percentage_7d_in_currency == 0
                      ? COLORS.lightGray3
                      : item.price_change_percentage_7d_in_currency > 0
                      ? COLORS.lightGreen
                      : COLORS.red;
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: SIZES.padding,
                        marginBottom: SIZES.radius,
                      }}
                    >
                      <View
                        style={{
                          flex: 1.5,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={{ height: 20, width: 20 }}
                        />

                        <Text
                          style={{
                            width: "25%",
                            marginLeft: SIZES.radius,
                            color: COLORS.white,
                            ...FONTS.h3,
                          }}
                        >
                          {item.name}
                        </Text>

                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                          }}
                        >
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
                                  data: item?.sparkline_in_7d?.price.splice(
                                    0,
                                    item?.sparkline_in_7d?.price.length / 7
                                  ),
                                },
                              ],
                            }}
                            width={100}
                            height={60}
                            chartConfig={{
                              color: () => priceColor,
                            }}
                            bezier
                            style={{ paddingRight: 0 }}
                          />
                        </View>

                        <View
                          style={{
                            flex: 1,
                            alignItems: "flex-end",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ color: COLORS.white, ...FONTS.h4 }}>
                            {"\u20B9"}{" "}
                            {item?.current_price.toLocaleString("en-IN")}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              alignItems: "center",
                            }}
                          >
                            {item.price_change_percentage_7d_in_currency !=
                              0 && (
                              <Image
                                source={icons.upArrow}
                                style={{
                                  height: 10,
                                  width: 10,
                                  tintColor: priceColor,
                                  transform:
                                    item.price_change_percentage_7d_in_currency >
                                    0
                                      ? [{ rotate: "45deg" }]
                                      : [{ rotate: "120deg" }],
                                }}
                              />
                            )}

                            <Text
                              style={{
                                marginLeft: 5,
                                color: priceColor,
                                ...FONTS.body5,
                              }}
                            >
                              {item?.price_change_percentage_7d_in_currency?.toFixed(
                                2
                              )}
                              %
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          );
        }}
      />
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
        <HeaderBar title={"Market"} />
        {renderTabBar()}

        {renderButtons()}

        {renderList()}
      </View>
    </MainLayout>
  );
};

function mapStateToProps(state) {
  return {
    coins: state?.marketReducer.coins,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCoinMarket: (...args) => {
      return dispatch(getCoinMarket(...args));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Market);
