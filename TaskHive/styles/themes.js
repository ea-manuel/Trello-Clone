// styles/themes.js
import { StyleSheet, Platform, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const PRIMARY_COLOR = "#0B1F3A";

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
  margin: 10,
 
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
  searchBackground:"transparent",
  searchBorderColor: '#0A072B',
},
settingsModal: {
  backgroundColor: "#1A2F4D",
  headerTextColor: "white",
  borderTopColor: "#0B1F3A",
},
favouritemodalView: {
    flexGrow:1,
    backgroundColor:"#1A2F4D",
    padding: 0,
    paddingTop: 0,
    margin: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    width: '100%',
    alignItems: "center",
    justifyContent:'flex-start',
    height:'100%'
  },
    favouritemodalTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    color:'white',
    paddingLeft:20,
  
  },
    favouriteemptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color:"#6C92C4",
    alignSelf: "center",
    justifyContent:'center',
  },
   favouriteheader: {
    height: 90,
    width:'100%',
    backgroundColor: "#0B1F3A",
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    bottom: 20,
    alignItems: "center",
    
  },
  favouriteicon: {
    position: "absolute",
    right:0,
  },
 OfflineBoardscontainer: { flex: 1, backgroundColor: "#fff" },
  OfflineBoardsmainpage: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    paddingHorizontal: 10,
    paddingBottom: 5
  },
  OfflineBoardsheader: {
    height: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  OfflineBoardsheaderText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center"
  },
  OfflineBoardsiconButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  OfflineBoardsworkspaceLabel: {
    fontWeight: "bold",
    marginTop: 12,
    marginLeft: 18,
    fontSize: 15,
    color: "#111"
  },
  OfflineBoardsboardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginLeft: 18
  },
  OfflineBoardsboardVisual: {
    width: 48,
    height: 32,
    backgroundColor: "#1783e5",
    borderRadius: 4,
    marginRight: 16
  },
  OfflineBoardsboardTitle: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500"
  },
  OfflineBoardsfab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007CF0",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5
  },
  // Modal styles
  OfflineBoardsmodalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    padding: 20
  },
  OfflineBoardsmodalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20
  },
  OfflineBoardsmodalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0B1F3A",
    marginBottom: 12
  },
  OfflineBoardsinput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#222",
    marginBottom: 20,
    fontSize: 16
  },
  OfflineBoardsmodalButtons: { flexDirection: "row", justifyContent: "flex-end" },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10
  },
  OfflineBoardscancelButton: { backgroundColor: "#555" },
  OfflineBoardssaveButton: { backgroundColor: "#007CF0" },
  OfflineBoardsmodalButtonText: { color: "white", fontWeight: "bold" },
// templates styles
  templatesContainer: {
    flex: 1,
    backgroundColor: "#f7f7f7" // light background
  },
  templatesHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B1F3A",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16
  },
  templatesHeaderTitle: {
    color: "#0B1F3A",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12
  },
  templatesFilterBar: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    paddingBottom: 50
  },
  templatesFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "gray",
    marginRight: 10,
    height: 35
  },
  templatesFilterButtonActive: {
    backgroundColor: "#e0e0e0",
    borderColor: "#0B1F3A"
  },
  templatesFilterText: {
    color: "#0B1F3A",
    fontWeight: "600"
  },
  templatesFilterTextActive: {
    color: "#0B1F3A"
  },
  templatesList: {
    padding: 16
  },
  templatesCardWrapper: {
    marginBottom: 24
  },
  templatesCard: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
    justifyContent: "flex-start"
  },
  templatesRect: {
    position: "absolute",
    borderRadius: 8
  },
  templatesCardTitle: {
    color: "#0B1F3A",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8
  },
  templatesCardDescRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8
  },
  templatesCardDesc: {
    color: "#555",
    fontSize: 14
  },
  //Board details styles
  BoardDetailscontainer: {
    flex: 1,
    color: "black"
  },
  BoardDetailstopBar: {
    height: 110,
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    bottom: 20
  },
  BoardDetailsbackButton: {
    padding: 10
  },
  BoardDetailstitleContainer: {
    flex: 1,
    maxWidth: SCREEN_WIDTH * 0.4,
    marginHorizontal: 10,
    justifyContent: "center"
  },
  BoardDetailstitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "left"
  },
  BoardDetailsiconContainer: {
    flexDirection: "row",
    position: "absolute",
    right: -5,
    top: 50,
    alignItems: "center"
  },
  BoardDetailsiconButton: {
    padding: 10
  },
  BoardDetailscontent: {
    flex: 1,
    alignItems: "center"
  },
  BoardDetailscreatelist: {
    backgroundColor: "#09143c",
    width: 160,
    height: 45,
    flexDirection: "row",
    borderRadius: 25,
    borderColor: "#722f37",
    borderWidth: 1.5,
    alignItems: "center",
    paddingHorizontal: 20,
    elevation: 8,
    marginVertical: 10
  },
  BoardDetailslistCard: {
    backgroundColor: "#6F8FAF",
    alignItems: "center",
    marginLeft: 15,
    width: 270,
    borderRadius: 30,
    height: 400,
    paddingTop: 10,
    marginTop: 20,
    borderColor: "white",
    borderWidth: 2
  },
  BoardDetailslistTitleInput: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },
  BoardDetailslistTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 15
  },
  BoardDetailscard: {
    backgroundColor: "#0e1d3e",
    marginHorizontal: 10,
    textAlign: "left",
    width: 250,
    height: 50,
    marginVertical: 5,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "white",
    flexDirection: "row",
    alignItems: "center"
  },
  BoardDetailscardInput: {
    borderColor: "white",
    borderWidth: 1,
    width: 270,
    alignItems: "center",
    textAlign: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    color: "white",
    paddingVertical: 6
  },
  BoardDetailscardText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    paddingLeft: 10
  },
  BoardDetailscompletedText: {
    textDecorationLine: "line-through",
    color: "#888"
  },
  BoardDetailsmodalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  BoardDetailsmodalView: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 20,
    margin: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    minWidth: 300,
    alignItems: "center"
  },
  BoardDetailsmodalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10
  },
  BoardDetailsmodalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center"
  },
  BoardDetailsmodalButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6
  },
  BoardDetailsmodalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },

  // CardMenuModal styles
  CardMenuModalmenuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end"
  },
  CardMenuModalmenuContainer: {
    backgroundColor: "#181A20",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 24,
    minHeight: "85%",
    maxHeight: "95%",
    elevation: 12
  },
  CardMenuModalmenuTopBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  CardMenuModalcoverButton: {
    backgroundColor: "#23263A",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 14
  },
  CardMenuModalcoverButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  },
  CardMenuModalsection: {
    backgroundColor: "#22242d",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18
  },
  CardMenuModalactivitiesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  CardMenuModalactivitiesTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20
  },
  CardMenuModaltodoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 4
  },
  CardMenuModaltodoBadge: {
    width: 32,
    height: 24,
    backgroundColor: "#3CD6FF",
    borderRadius: 6,
    marginRight: 10
  },
  CardMenuModaltodoTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  CardMenuModaltodoSubtitle: {
    color: "#aaa",
    fontSize: 13
  },
  CardMenuModalmoveText: {
    color: "#3CD6FF",
    fontWeight: "bold",
    fontSize: 15
  },
  CardMenuModalquickActionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  CardMenuModalquickActionsTitle: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 14,
    flex: 1
  },
  CardMenuModalquickActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 8
  },
  CardMenuModalquickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10
  },
  CardMenuModalquickActionText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 15
  },
  CardMenuModaldescriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
  },
  CardMenuModaldescriptionTitle: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 15
  },
  CardMenuModaldescriptionInput: {
    color: "#fff",
    backgroundColor: "#23263A",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    fontSize: 15,
    minHeight: 48
  },
  CardMenuModalmenuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#23263A"
  },
  CardMenuModalmenuRowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500"
  },
  CardMenuModalcommentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#23263A",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  CardMenuModalavatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3CD6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  CardMenuModalavatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  },
  CardMenuModalcommentInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    marginRight: 8
  },
  recentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentCardText: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recentCardTimestamp: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
    alignSelf: 'flex-end',
  },
  boardScreenMenuContainer: {
    flex: 1,
    backgroundColor: '#ADD8E6',
  },
  boardScreenMenuTopBar: {
    height: 110,
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    bottom: 20,
  },
  boardScreenMenuBackButton: {
    padding: 10,
  },
  boardScreenMenuTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    marginLeft: 10,
  },
  boardScreenMenuContent: {
    flex: 1,
    padding: 20,
  },
  boardScreenMenuColorSection: {
    marginBottom: 20,
    marginTop: -15,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  boardScreenMenuColorSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    padding: 5,
    borderRadius: 8,
    textAlign: 'left',
    marginBottom: 10,
  },
  boardScreenMenuColorList: {
    paddingHorizontal: 5,
  },
  boardScreenMenuColorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  boardScreenMenuImageButton: {
    backgroundColor: '#6F8FAF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  boardScreenMenuImageButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  boardScreenMenuIconSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  boardScreenMenuIconButton: {
    padding: 10,
  },
  boardScreenMenuDetailsSection: {
    marginBottom: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    backgroundColor: '#6F8FAF',
  },
  boardScreenMenuCollaboratorsSection: {
    marginBottom: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    backgroundColor: '#6F8FAF',
  },
  boardScreenMenuSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  boardScreenMenuSubSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  boardScreenMenuInviteInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  boardScreenMenuCollaboratorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  boardScreenMenuCollaboratorName: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  boardScreenMenuCollaboratorRole: {
    fontSize: 16,
    color: '#ddd',
    fontWeight: '400',
  },
  boardScreenMenuEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A7A9A',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  boardScreenMenuEditButtonText: {
    fontSize: 16,
    color: 'white',
    marginRight: 5,
  },
  boardScreenMenuDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  boardScreenMenuDetailLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  boardScreenMenuDetailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boardScreenMenuDetailValue: {
    fontSize: 16,
    color: 'white',
    marginRight: 5,
  },
  boardScreenMenuMenuItem: {
    backgroundColor: '#6F8FAF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boardScreenMenuDeleteButton: {
    backgroundColor: '#E74C3C',
  },
  boardScreenMenuMenuItemIcon: {
    marginRight: 10,
  },
  boardScreenMenuMenuItemText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
  boardScreenMenuModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardScreenMenuModalView: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    margin: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    minWidth: 290,
  },
  boardScreenMenuModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  boardScreenMenuModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
  },
  boardScreenMenuModalIcon: {
    marginRight: 10,
  },
  boardScreenMenuModalOptionText: {
    fontSize: 16,
    color: '#fff',
  },
  boardScreenMenuModalButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  boardScreenMenuModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
  profileCardBg: '#0A072B',
  sectionBorderColor: '#6C92C4',
  sectionHeaderColor: '#EAEFFF',
  sectionSubtextColor: '#B0C5E5',
  modalBackground: 'rgba(0, 0, 0, 0.5)',
  modalViewBg: '#141627',
  modalTextColor: '#EAEFFF',
  headerTextColor: "white",
  searchBackground:"#020110",
  searchBorderColor: '#0A072B',
  searchTextColor:'white',
  
},
settingsModal: {
  backgroundColor: "#020110",
  headerTextColor: "white",
  borderTopColor: "white",
},
favouritemodalView: {
    flexGrow:1,
    backgroundColor:"#020110",
    padding: 0,
    paddingTop: 0,
    margin: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    width: '100%',
    alignItems: "center",
    justifyContent:'flex-start',
    height:'100%'
  },
    favouritemodalTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    color:'white',
    paddingLeft:20,
  
  },
    favouriteemptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color:"#6C92C4",
    alignSelf: "center",
    justifyContent:'center',
  },
   favouriteheader: {
    height: 90,
    width:'100%',
    backgroundColor: "#0B1F3A",
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    bottom: 20,
    alignItems: "center",
    
  },
  favouriteicon: {
    position: "absolute",
    right:0,
  },
  favouriteboardcard: {
  backgroundColor: "white", // Deep blue-gray
  width:"100%",
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
  margin: 10,
 
},
//Offline boards styles
 OfflineBoardscontainer: { flex: 1, backgroundColor: "#020110" },
  OfflineBoardsmainpage: {
    backgroundColor: "#0A072B",
    paddingTop: Platform.OS === "ios" ? 40 : 20,
    paddingHorizontal: 10,
    paddingBottom: 5
  },
  OfflineBoardsheader: {
    height: 75,
    width:"100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0A072B"
  },
  OfflineBoardsheaderText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center"
  },
  OfflineBoardsiconButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  OfflineBoardsworkspaceLabel: {
    fontWeight: "bold",
    marginTop: 12,
    marginLeft: 18,
    fontSize: 15,
    color: "white"
  },
  OfflineBoardsboardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginLeft: 18
  },
  OfflineBoardsboardVisual: {
    width: 48,
    height: 32,
    backgroundColor: "#09034E",
    borderRadius: 4,
    marginRight: 16
  },
  OfflineBoardsboardTitle: {
    fontSize: 16,
    color: "white",
    fontWeight: "500"
  },
  OfflineBoardsfab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#09034E",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5
  },
  // Modal styles
  OfflineBoardsmodalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    padding: 20
  },
  OfflineBoardsmodalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20
  },
  OfflineBoardsmodalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0B1F3A",
    marginBottom: 12
  },
  OfflineBoardsinput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#222",
    marginBottom: 20,
    fontSize: 16
  },
  OfflineBoardsmodalButtons: { flexDirection: "row", justifyContent: "flex-end" },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10
  },
  OfflineBoardscancelButton: { backgroundColor: "#555" },
  OfflineBoardssaveButton: { backgroundColor: "#007CF0" },
  OfflineBoardsmodalButtonText: { color: "white", fontWeight: "bold" },

// =====================
// templates styles
// =====================
  templatesContainer: {
    flex: 1,
    backgroundColor: "#020110" // dark background
  },
  templatesHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A072B",
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16
  },
  templatesHeaderTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12
  },
  templatesFilterBar: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    paddingBottom: 50
  },
  templatesFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "gray",
    marginRight: 10,
    height: 35
  },
  templatesFilterButtonActive: {
    backgroundColor: "#23272F",
    borderColor: "#fff"
  },
  templatesFilterText: {
    color: "#fff",
    fontWeight: "600"
  },
  templatesFilterTextActive: {
    color: "#fff"
  },
  templatesList: {
    padding: 16
  },
  templatesCardWrapper: {
    marginBottom: 24
  },
  templatesCard: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
    justifyContent: "flex-start"
  },
  templatesRect: {
    position: "absolute",
    borderRadius: 8
  },
  templatesCardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8
  },
  templatesCardDescRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8
  },
  templatesCardDesc: {
    color: "#b0b0b0",
    fontSize: 14
  },

// =====================
// help styles
// =====================
  helpContainer: {
    flex: 1,
    backgroundColor: "#020110",
    paddingTop: 0,
    paddingHorizontal: 0
  },
  helpSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dedede",
    borderRadius: 16,
    marginBottom: 24,
    paddingHorizontal: 12,
    height: 44,
    alignSelf: "center",
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2
  },
  helpSearchInput: {
    flex: 1,
    fontSize: 18,
    color: "#888",
    fontWeight: "bold",
    letterSpacing: 1
  },
  helpSearchIcon: {
    marginLeft: 8
  },
  helpCardContainer: {
    marginBottom: 18
  },
  helpCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2
  },
  helpCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    letterSpacing: 1
  },
  helpCardContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1
  },
  helpCardContentText: {
    fontSize: 15,
    color: "#222",
    lineHeight: 20
  },
  helpHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B1F3A", // same as templates header
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    marginBottom:50,
  },
  helpHeaderBackButton: {
    marginRight: 8
  },
  helpHeaderTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    flex: 1
  },
  helpHeaderSearchBar: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dedede",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 44,
    marginLeft: 8
  },

  //Board details styles
  BoardDetailscontainer: {
    flex: 1,
    color: "black",
    backgroundColor:"#020110"
  },
  BoardDetailstopBar: {
    height: 110,
    backgroundColor:"#0A072B",
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    bottom: 20
  },
  BoardDetailsbackButton: {
    padding: 10
  },
  BoardDetailstitleContainer: {
    flex: 1,
    maxWidth: SCREEN_WIDTH * 0.4,
    marginHorizontal: 10,
    justifyContent: "center"
  },
  BoardDetailstitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "left"
  },
  BoardDetailsiconContainer: {
    flexDirection: "row",
    position: "absolute",
    right: -5,
    top: 50,
    alignItems: "center"
  },
  BoardDetailsiconButton: {
    padding: 10
  },
  BoardDetailscontent: {
    flex: 1,
    alignItems: "center"
  },
  BoardDetailscreatelist: {
    backgroundColor: "#021734",
    width: 160,
    height: 45,
    flexDirection: "row",
    borderRadius: 25,
    borderColor: "#722f37",
    borderWidth: 1.5,
    alignItems: "center",
    paddingHorizontal: 20,
    elevation: 8,
    marginVertical: 10
  },
  BoardDetailslistCard: {
    backgroundColor: "#021734",
    alignItems: "center",
    marginLeft: 15,
    width: 270,
    borderRadius: 30,
    height: 400,
    paddingTop: 10,
    marginTop: 20,
    borderColor: "white",
    borderWidth: 2
  },
  BoardDetailslistTitleInput: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },
  BoardDetailslistTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 15
  },
  BoardDetailscard: {
    backgroundColor: "#0e1d3e",
    marginHorizontal: 10,
    textAlign: "left",
    width: 250,
    height: 50,
    marginVertical: 5,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "white",
    flexDirection: "row",
    alignItems: "center"
  },
  BoardDetailscardInput: {
    borderColor: "white",
    borderWidth: 1,
    width: 270,
    alignItems: "center",
    textAlign: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    color: "white",
    paddingVertical: 6
  },
  BoardDetailscardText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    paddingLeft: 10
  },
  BoardDetailscompletedText: {
    textDecorationLine: "line-through",
    color: "#888"
  },
  BoardDetailsmodalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  BoardDetailsmodalView: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 20,
    margin: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    minWidth: 300,
    alignItems: "center"
  },
  BoardDetailsmodalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10
  },
  BoardDetailsmodalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center"
  },
  BoardDetailsmodalButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6
  },
  BoardDetailsmodalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },

  // CardMenuModal styles
  CardMenuModalmenuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end"
  },
  CardMenuModalmenuContainer: {
    backgroundColor: "#181A20",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 24,
    minHeight: "85%",
    maxHeight: "95%",
    elevation: 12
  },
  CardMenuModalmenuTopBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  CardMenuModalcoverButton: {
    backgroundColor: "#23263A",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 14
  },
  CardMenuModalcoverButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  },
  CardMenuModalsection: {
    backgroundColor: "#22242d",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18
  },
  CardMenuModalactivitiesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  CardMenuModalactivitiesTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20
  },
  CardMenuModaltodoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 4
  },
  CardMenuModaltodoBadge: {
    width: 32,
    height: 24,
    backgroundColor: "#3CD6FF",
    borderRadius: 6,
    marginRight: 10
  },
  CardMenuModaltodoTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  CardMenuModaltodoSubtitle: {
    color: "#aaa",
    fontSize: 13
  },
  CardMenuModalmoveText: {
    color: "#3CD6FF",
    fontWeight: "bold",
    fontSize: 15
  },
  CardMenuModalquickActionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  CardMenuModalquickActionsTitle: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 14,
    flex: 1
  },
  CardMenuModalquickActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 8
  },
  CardMenuModalquickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 10
  },
  CardMenuModalquickActionText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 15
  },
  CardMenuModaldescriptionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
  },
  CardMenuModaldescriptionTitle: {
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 15
  },
  CardMenuModaldescriptionInput: {
    color: "#fff",
    backgroundColor: "#23263A",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    fontSize: 15,
    minHeight: 48
  },
  CardMenuModalmenuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#23263A"
  },
  CardMenuModalmenuRowText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500"
  },
  CardMenuModalcommentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#23263A",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  CardMenuModalavatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3CD6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  },
  CardMenuModalavatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15
  },
  CardMenuModalcommentInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    marginRight: 8
  },
  recentCard: {
    backgroundColor: '#181A2A',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#23244A',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentCardText: {
    color: '#EAEFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recentCardTimestamp: {
    color: '#A0A4C0',
    fontSize: 12,
    fontStyle: 'italic',
    alignSelf: 'flex-end',
  },
  boardScreenMenuContainer: {
    flex: 1,
    backgroundColor: '#020110',
  },
  boardScreenMenuTopBar: {
    height: 110,
    backgroundColor: '#0A072B',
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    bottom: 20,
  },
  boardScreenMenuBackButton: {
    padding: 10,
  },
  boardScreenMenuTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    marginLeft: 10,
  },
  boardScreenMenuContent: {
    flex: 1,
    padding: 20,
  },
  boardScreenMenuColorSection: {
    marginBottom: 20,
    marginTop: -15,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  boardScreenMenuColorSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    padding: 5,
    borderRadius: 8,
    textAlign: 'left',
    marginBottom: 10,
  },
  boardScreenMenuColorList: {
    paddingHorizontal: 5,
  },
  boardScreenMenuColorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  boardScreenMenuImageButton: {
    backgroundColor: '#6F8FAF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  boardScreenMenuImageButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  boardScreenMenuIconSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  boardScreenMenuIconButton: {
    padding: 10,
  },
  boardScreenMenuDetailsSection: {
    marginBottom: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    backgroundColor: '#021734',
  },
  boardScreenMenuCollaboratorsSection: {
    marginBottom: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    backgroundColor: '#021734',
  },
  boardScreenMenuSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  boardScreenMenuSubSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  boardScreenMenuInviteInput: {
    backgroundColor: '#23253A',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  boardScreenMenuCollaboratorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  boardScreenMenuCollaboratorName: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  boardScreenMenuCollaboratorRole: {
    fontSize: 16,
    color: '#ddd',
    fontWeight: '400',
  },
  boardScreenMenuEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A7A9A',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  boardScreenMenuEditButtonText: {
    fontSize: 16,
    color: 'white',
    marginRight: 5,
  },
  boardScreenMenuDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  boardScreenMenuDetailLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  boardScreenMenuDetailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boardScreenMenuDetailValue: {
    fontSize: 16,
    color: 'white',
    marginRight: 5,
  },
  boardScreenMenuMenuItem: {
    backgroundColor: '#021734',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boardScreenMenuDeleteButton: {
    backgroundColor: '#E74C3C',
  },
  boardScreenMenuMenuItemIcon: {
    marginRight: 10,
  },
  boardScreenMenuMenuItemText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
  boardScreenMenuModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardScreenMenuModalView: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    margin: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    minWidth: 290,
  },
  boardScreenMenuModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  boardScreenMenuModalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
  },
  boardScreenMenuModalIcon: {
    marginRight: 10,
  },
  boardScreenMenuModalOptionText: {
    fontSize: 16,
    color: '#fff',
  },
  boardScreenMenuModalButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  boardScreenMenuModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
