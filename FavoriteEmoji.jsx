import React, { useState } from "react"; // <-- FIX 1: Must import useState
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";

const { width } = Dimensions.get("window"); // height is not used, so we can remove it from here if not needed elsewhere

// --- Data Fixes ---
const emojieData = [
  {
    id: 1,
    name: "good",
    emojie: "👌",
  },
  {
    id: 2,
    name: "perfect",
    emojie: "💯",
  },
  {
    id: 3,
    name: "smile",
    emojie: "😊",
  },
  {
    id: 4,
    name: "love",
    emojie: "❤️",
  },
  {
    id: 5, // Added another emoji for more options
    name: "star",
    emojie: "⭐",
  },
];

const FavoriteEmoji = () => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleEmojiePress = (emojie) => {
    // Toggles selection: if the tapped emoji is already selected, unselect it (set to null), otherwise select it.
    if (selected && emojie.id === selected.id) {
      setSelected(null);
    } else {
      setSelected(emojie);
    }
    console.log("Selected object is:", emojie);
  };

  // --- MODIFIED: handleLikePress now takes the specific emoji to like ---
  const handleLikePress = (emojieToLike) => {
    const isAdded = favoriteIds.includes(emojieToLike.id);

    if (isAdded) {
      // If already a favorite, remove it (unlike)
      Alert.alert(
        "Remove Favorite?",
        `Do you want to remove ${emojieToLike.emojie} from your favorites?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              setFavoriteIds(
                favoriteIds.filter((id) => id !== emojieToLike.id)
              ); // Filter out the ID
              Alert.alert(
                "Removed",
                `${emojieToLike.emojie} removed from favorites.`
              );
            },
          },
        ]
      );
    } else {
      // If not a favorite, add it (like)
      setFavoriteIds([...favoriteIds, emojieToLike.id]);
      Alert.alert(
        "Success",
        `${emojieToLike.emojie} has been added to your favorites!`
      );
    }
    // Optionally, clear selection if the liked emoji was also selected
    if (selected && selected.id === emojieToLike.id) {
      setSelected(null);
    }
  };

  // --- Rendering Fixes ---
  return (
    <View style={styles.container}>
      <Text style={styles.header}>EMOJIE PICKER</Text>
      <Text style={styles.favoriteText}>Favorites: {favoriteIds.length}</Text>
      <View style={styles.favoriteDisplay}>
        <Text style={styles.favoriteText}>Your Favorite Emojis:</Text>
        <View style={styles.favoriteList}>
          {emojieData
            .filter((e) => favoriteIds.includes(e.id))
            .map((e) => (
              <Text key={`fav-${e.id}`} style={styles.favoriteEmojiItem}>
                {e.emojie}
              </Text>
            ))}
        </View>
      </View>

      <View style={styles.emojieContainer}>
        {emojieData.map((e) => {
          const isSelected = selected?.id === e.id;
          const isFavorite = favoriteIds.includes(e.id); // Check if emoji is a favorite

          return (
            // FIX: The key must be on the outermost element of the map (the Pressable)
            <Pressable
              key={e.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => handleEmojiePress(e)} // Main card press for selection
            >
              <Text style={styles.emojie}>{e.emojie}</Text>
              <Text style={styles.name}>{e.name}</Text>
              {/* --- NEW: Like Button using Emojis --- */}
              <Pressable
                style={styles.likeButton} // No separate style for 'liked' background, just the emoji itself changes
                onPress={() => handleLikePress(e)} // Call handler with current emoji
              >
                <Text style={styles.likeEmoji}>
                  {isFavorite ? "❤️" : "🤍"}{" "}
                  {/* Toggle between filled and hollow heart */}
                </Text>
              </Pressable>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

// --- Style Fixes and Improvements ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  favoriteText: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  favoriteDisplay: {
    width: "90%",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
  },
  favoriteList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 5,
  },
  favoriteEmojiItem: {
    fontSize: 28,
    marginHorizontal: 5,
  },
  favoriteEmptyText: {
    color: "#ccc",
    fontSize: 14,
  },
  emojieContainer: {
    padding: 11,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  card: {
    width: width * 0.25, // Slightly larger cards to fit the button
    height: width * 0.25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "teal",
    borderRadius: 8,
    backgroundColor: "#fff",
    position: "relative", // Needed for absolute positioning of like button
    paddingTop: 10, // Give space for the like button at the top
  },
  emojie: {
    fontSize: 30,
  },
  name: {
    marginTop: 5,
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  cardSelected: {
    backgroundColor: "gold",
    borderColor: "red",
    borderWidth: 4,
  },
  // --- NEW: Like Button Styles (Emoji Version) ---
  likeButton: {
    position: "absolute",
    top: 0, // Adjusted position to be right at the top edge
    right: 0, // Adjusted position to be right at the right edge
    padding: 5,
    // No background, just the emoji
  },
  likeEmoji: {
    fontSize: 18, // Adjust size of the heart emoji
  },
});

export default FavoriteEmoji;
