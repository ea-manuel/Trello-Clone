// styles/themes.js
import { StyleSheet } from "react-native";

export const lightTheme = StyleSheet.create({
  mainpage: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingVertical: 20,
    marginTop: 10,
  },
   boardcard: {
  backgroundColor: "white", // Deep blue-gray
 
  borderRadius: 10,
  paddingVertical: 15,
  paddingHorizontal: 15,
  flexDirection: "row",
  alignItems: "center",
  elevation: 4,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 6,
  marginVertical: 5,
  margin: 8,
},
boardcardText: {
  color: "black", // Soft off-white
  fontWeight: "500",
  fontSize: 22,
  marginLeft: 15,
},
  boardcardTouchable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deleteButton: {
    padding: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  emptySubText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#808080",
    marginBottom: 20,
  },
  createBoardButton: {
    width: 170,
    alignSelf: "flex-end",
    marginRight: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0B1F3A",
    paddingVertical: 14,
    elevation: 5,
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgb(243, 242, 242)",
    padding: 30,
    margin: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    width: 350,
    alignItems: "center",
    justifyContent:'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    width: 300,
    backgroundColor: "#f0f0f0",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent:"space-evenly",
    width: "100%",
  },
  createButton: {
    backgroundColor: "#0B1F3A",
    borderRadius: 6,
    margin: 5,
  },
  deleteConfirmButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 6,
    margin: 5,
  },
  cancelButton: {
    borderRadius: 6,
    margin: 5,
  },
 quickActionsWrapper: {
  marginVertical: 8,
  marginHorizontal: 0,
  borderRadius: 16,
  backgroundColor: "transparent",  // same as main background
  paddingVertical: 10,          // a tad longer container vertically
  paddingHorizontal: 0,
  borderColor:"#05081c",
  // borderBottomWidth:2,
  // borderLeftWidth:2,
  // borderRightWidth:2,
  marginBottom:0,
  paddingBottom:0,
},
quickActionsGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

quickActionCard: {
  width: "40%",
  aspectRatio: 1.1,
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "space-evenly",
  marginVertical: 10,
  marginHorizontal:19,
  backgroundColor: "transparent",  // no fill
  borderWidth: 2,
  shadowColor: "white",
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 4,
},

// Borders for each quick action — dark versions of bright colors:
borderCreateBoard: {
  borderColor: "#1F4B8B",  // Dark Blue
},
borderFavorites: {
  borderColor: "#8B6B02",  // Dark Yellow
},
borderRecent: {
  borderColor: "#8B3302",  // Dark Orange
},
borderSettings: {
  borderColor: "#5B2E8B",  // Dark Purple
  // Extra outline for settings:
    // Light purple glow
  shadowOpacity: 0.7,
  shadowRadius: 8,
  elevation: 8,
},

quickActionText: {
  color: "black",
  fontWeight: "700",
  fontSize: 16,
  marginTop: 10,
  textAlign: "center",
  textShadowColor: "rgba(0, 0, 0, 0.4)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},
quickActionsHeading: {
  fontSize: 25,
  fontWeight: "600",
  color: "black",
  textAlign: "left",
  marginBottom: 4,
  marginTop: 10,
  marginLeft:19,

},

quickActionsSubheading: {
  fontSize: 19,
  fontWeight: "400",
  color: "black",
  textAlign: "left",
  marginBottom: 16,
  marginLeft:19,
},


//Header light theme settings
   Headermainpage: {
    backgroundColor: "#0B1F3A",
    paddingTop: 20,
    paddingHorizontal: 10
  },
  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconButton: {
    marginLeft: 10
  },
settings: {
  containerBg: '#0B1F3A',
  profileCardBg: '#0B1F3A',
  sectionBorderColor: 'white',
  sectionHeaderColor: 'white',
  sectionSubtextColor: 'white',
  modalBackground: 'rgba(0, 0, 0, 0.5)',
  modalViewBg: 'rgba(255, 255, 255, 0.85)',
  modalTextColor: 'white',
},
settingsModal: {
  backgroundColor: "#0B1F3A",
  headerTextColor: "white",
  borderTopColor: "#0B1F3A",
},


});
export const darkTheme = StyleSheet.create({
  //Homescreen dark theme settings
    mainpage: {
    flex: 1,
    backgroundColor: "#020110",
  },
  scrollContent: {
  flexGrow: 1,
  justifyContent: "flex-start",
  paddingVertical: 20,
  // No marginTop
},

 boardcard: {
  backgroundColor: "#141627", // Deep blue-gray
  borderColor: "#2A2C3E",
  borderWidth: 1,
  borderRadius: 10,
  paddingVertical: 15,
  paddingHorizontal: 15,
  flexDirection: "row",
  alignItems: "center",
  elevation: 4,
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 6,
  marginVertical: 5,
  margin: 8,
},
boardcardText: {
  color: "#EAEFFF", // Soft off-white
  fontWeight: "500",
  fontSize: 22,
  marginLeft: 15,
},

  boardcardTouchable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deleteButton: {
    padding: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color:"#6C92C4",
  },
  emptySubText: {
    fontSize: 18,
    fontWeight: "500",
    color:"#6C92C4",
    marginBottom: 20,
  },
  createBoardButton: {
    width: 170,
    alignSelf: "flex-end",
    marginRight: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0B1F3A",
    paddingVertical: 14,
    elevation: 5,
    borderRadius: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "rgb(243, 242, 242)",
    padding: 30,
    margin: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    width: 350,
    alignItems: "center",
    justifyContent:'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    width: 300,
    backgroundColor: "#f0f0f0",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent:"space-evenly",
    width: "100%",
  },
  createButton: {
    backgroundColor: "#0B1F3A",
    borderRadius: 6,
    margin: 5,
  },
  deleteConfirmButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 6,
    margin: 5,
  },
  cancelButton: {
    borderRadius: 6,
    margin: 5,
  },
quickActionsWrapper: {
  marginVertical: 8,
  marginHorizontal: 0,
  borderRadius: 16,
  backgroundColor: "transparent",  // same as main background
  paddingVertical: 10,          // a tad longer container vertically
  paddingHorizontal: 0,
  borderColor:"#05081c",
  borderWidth:2,
  marginBottom:0,
  paddingBottom:0,
},

quickActionsGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

quickActionCard: {
  width: "40%",
  aspectRatio: 1.1,
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "space-evenly",
  marginVertical: 10,
  marginHorizontal:19,
  backgroundColor: "transparent",  // no fill
  borderWidth: 2,
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 4,
  elevation: 4,
},

// Borders for each quick action — dark versions of bright colors:
borderCreateBoard: {
  borderColor: "#1F4B8B",  // Dark Blue
},
borderFavorites: {
  borderColor: "#8B6B02",  // Dark Yellow
},
borderRecent: {
  borderColor: "#8B3302",  // Dark Orange
},
borderSettings: {
  borderColor: "#5B2E8B",  // Dark Purple
  shadowOpacity: 0.7,
  shadowRadius: 8,
  elevation: 8,
},

quickActionText: {
  color: "white",
  fontWeight: "700",
  fontSize: 16,
  marginTop: 10,
  textAlign: "center",
  textShadowColor: "rgba(0, 0, 0, 0.4)",
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},
quickActionsHeading: {
  fontSize: 25,
  fontWeight: "600",
  color: "white",
  textAlign: "left",
  marginBottom: 4,
  marginTop: 10,
  marginLeft:19,

},

quickActionsSubheading: {
  fontSize: 19,
  fontWeight: "400",
  color: "#CCCCCC",
  textAlign: "left",
  marginBottom: 16,
  marginLeft:19,
},


  //Header dark theme settings
   Headermainpage: {
    paddingTop: 20,
    paddingHorizontal: 10
  },
  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center"
  },
  iconButton: {
    marginLeft: 10
  },
  settings: {
  containerBg: '#020110',
  profileCardBg: '#0B1F3A',
  sectionBorderColor: '#6C92C4',
  sectionHeaderColor: '#EAEFFF',
  sectionSubtextColor: '#B0C5E5',
  modalBackground: 'rgba(0, 0, 0, 0.5)',
  modalViewBg: '#141627',
  modalTextColor: '#EAEFFF',
},
settingsModal: {
  backgroundColor: "#0B1F3A",
  headerTextColor: "white",
  borderTopColor: "white",
},

});
