import {Link, Stack} from "expo-router";
import MainView from "../components/views/mainView";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Page Not Found", headerShown: false }} />
            <MainView>
                <h1>404 - Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
                <Link href="/" style={{ marginTop: 20, fontSize: 18, color: "#fff" }}>
                    Go back to Home
                </Link>
            </MainView>
        </>
    );
}