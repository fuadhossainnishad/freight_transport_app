import Config from "react-native-config";

const AppConfig = {
    base_url: Config.BASE_URL,
    socket_url: Config.SOCKET_URL,
    map_key: Config.GOOGLE_MAPS_API_KEY,
    // PayDunya only renders the mobile money methods (and only returns a
    // checkout URL) when the invoice carries a customer phone, so the request
    // form prefills this. Falls back to the sandbox test number while
    // PAYDUNYA_MODE=test; set a real number in .env before going live.
    default_mobile_money_phone:
        Config.DEFAULT_MOBILE_MONEY_PHONE || "+22670189869"
};

export default AppConfig;