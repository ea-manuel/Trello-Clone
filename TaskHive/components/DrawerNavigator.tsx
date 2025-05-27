import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";

function CustomDrawerContent(props) {
  const router = useRouter();
  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: "#34495e", flex: 1 }}
    >
      <DrawerItem
        label="Home"
        labelStyle={{ color: "white" }}
        onPress={() => router.push("/")}
      />
      <DrawerItem
        label="Settings"
        labelStyle={{ color: "white" }}
        onPress={() => router.push("/settings")}
      />
      {/* Add more custom links as needed */}
      {/* <DrawerItem label="Profile" labelStyle={{ color: 'white' }} onPress={() => router.push('/profile')} /> */}
    </DrawerContentScrollView>
  );
}

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#34495e" // Your custom color
        },
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#ccc"
      }}
    />
  );
}
