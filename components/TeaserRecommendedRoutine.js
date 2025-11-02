import { ScrollView, StyleSheet } from "react-native";
import TeaserRoutineItem from "./RoutineItem";

export default function TeaserRecommendedRoutine({ items = [] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {items.map((item, index) => (
        <TeaserRoutineItem
          key={index}
          name={item.name}
          store={item.store}
          type={item.type}
          price={item.price}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 10,
    alignItems: "flex-start",
  },
});
