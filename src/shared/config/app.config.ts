import Config from "react-native-config";

const AppConfig = {
    base_url: Config.BASE_URL,
    socket_url: Config.SOCKET_URL,
    map_key: Config.MAP_API_KEY
};

export default AppConfig;