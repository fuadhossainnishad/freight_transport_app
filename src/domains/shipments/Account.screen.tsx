import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Account() {
    return (
        <View style={styles.container}>
            <Text>Account</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});