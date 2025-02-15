import React, { useState ,LayoutChangeEvent} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import ColorPicker from './ColorPicker';
import useLanguage from './Translate';

export function CustomTabBar({ state, descriptors, navigation }) {
  const colorPicked = ColorPicker();
  const CurrentLanguage = useLanguage();

  const icon = {
    Home: (props) => <Feather name="home" size={24} {...props} />,
    Chat: (props) => <Feather name="send" size={24} {...props} />,
    Account: (props) => <Feather name="user" size={24} {...props} />,
  };
  const [dimensions ,setDimensions] = useState({height : 20 , width : 100}); 
  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayout = (e:LayoutChangeEvent )=>{
    setDimensions({
      height : e.nativeEvent.layout.height,
      width : e.nativeEvent.layout.width,
    })
  }
  const tabPositonX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(()=>{
    return {
      transform : [{
        translateX : tabPositonX.value
      }]
    }
  })
  return (
    <View onLayout={onTabbarLayout} style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.tabbar}>
        <Animated.View
          style={[
            animatedStyle,
            {
              position : "absolute",
              backgroundColor : colorPicked,
              borderRadius : 30,
              marginHorizontal :12,
              height : dimensions.height - 15,
              width : buttonWidth - 25,
            }]}/>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          // Shared value and animated styles are now handled per item
          const scale = useSharedValue(0);

          React.useEffect(() => {
            scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
          }, [isFocused]);

          const AnimatedIconStyle = useAnimatedStyle(() => {
            const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
            const top = interpolate(scale.value, [0, 1], [1, 9]);
            return {
              transform: [{ scale: scaleValue }],
              top
            };
          });

          const AnimatedTextStyle = useAnimatedStyle(() => {
            const opacity = interpolate(scale.value, [0, 1], [1, 0]);
            return {
              opacity,
            };
          });

          const onPress = () => {
            tabPositonX.value = withSpring(buttonWidth * index  , { 
              duration : 1500
              })
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Use fallback icon if route.name is not found in the icon object
          const IconComponent = icon[route.name] || ((props) => <View {...props} />);

          return (
            <TouchableOpacity
              key={route.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabbarItem}
            >
              <Animated.View style={AnimatedIconStyle}>
                <IconComponent color={isFocused ? colorPicked : '#222'} />
              </Animated.View>
              <Animated.Text style={[{ color: isFocused ? colorPicked : '#222' , fontSize : 12 }, AnimatedTextStyle]}>
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    width: '80%',
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    marginHorizontal: 80,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 20 },
    shadowRadius: 1,
    shadowOpacity: 0.4,
    elevation: 3,
  },
  tabbarItem: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
});
