import React, { Component } from 'react';
import { Text, View, StyleSheet, Switch, Button, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as Animatable from 'react-native-animatable';
// The following syntax in deprecated
// import { Permissions, Notifications } from 'expo';
// see https://docs.expo.io/versions/v39.0.0/sdk/permissions/ for ref
import * as Permissions from 'expo-permissions';
// see https://docs.expo.io/versions/v39.0.0/sdk/notifications/ for ref
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';


class Reservation extends Component {
    
    static defaultState = () => ({
        guests: 1,
        smoking: false,
        date: `${new Date().toISOString().split("T")[0]} 
        ${new Date().toISOString().split("T")[1].split(".")[0]}`,
        showDateSelector: false
    });

    static navigationOptions = {
        title: 'Reserve Table',
    };

    constructor(props) {
        super(props);
        this.state = Reservation.defaultState();
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
              Alert.alert('Permission not granted to access the calendar');
            }
        }
        return permission;
    }
    async getDefaultCalendarSource() {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
        return defaultCalendars[0].source;
      }

    async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();
        const startDate = new Date(Date.parse(date));
        const endDate = new Date(Date.parse(date) + (2 * 60 * 60 * 1000)); // 2 hours
        const defaultCalendarSource =
        Platform.OS === 'ios'
          ? await getDefaultCalendarSource()
          : { isLocalAccount: true, name: 'Expo Calendar' };
        const newCalendarID = await Calendar.createCalendarAsync({
          title: 'Expo Calendar',
          color: 'blue',
          entityType: Calendar.EntityTypes.EVENT,
          sourceId: defaultCalendarSource.id,
          source: defaultCalendarSource,
          name: 'internalCalendarName',
          ownerAccount: 'personal',
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
        Calendar.createEventAsync(
          newCalendarID,
          {
            title: 'Con Fusion Table Reservation',
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong',
            startDate,
            endDate,
            timeZone: 'Asia/Hong_Kong',
          },
        );
        Alert.alert('Reservation has been added to your calendar');
      }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    handleReservation() {
        const { guests, smoking, date } = this.state;
        // In Alert.alert(), 1st str refers to title, 2nd refers to main text
        // 3rd Array refers to buttons of options, 4rd object is { cancelable: boolean }
        Alert.alert('Your Reservation OK?', 
        `Number of Guests: ${guests}\nSmoking? ${smoking}\nDate and Time: ${date}`, 
        [
            {
              text: 'CANCEL',
              style: 'cancel',
              onPress: () => this.resetForm(),
            },
            {
              text: 'OK',
              // 'CANCEL' and 'OK' have no differences by now
              onPress: () => {
                this.presentLocalNotification(this.state.date)
                this.addReservationToCalendar(this.state.date);
                this.resetForm();
              },
            },
        ], 
        { cancelable: false });
    }

    resetForm() {
        this.setState(Reservation.defaultState());
    }
    
    render() {
        const todayDate = new Date();

        return(
        <Animatable.View animation="zoomIn" duration={2000}>
          <ScrollView>
            <View style={styles.formRow}>
                <Text style={styles.formLabel}>Number of Guests</Text>
                <Picker
                    style={styles.formItem}
                    selectedValue={this.state.guests}
                    onValueChange={(itemValue, itemIndex) => this.setState({
                        guests: itemValue, showDateSelector: false})}>
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="6" value="6" />
                </Picker>
            </View>
            <View style={styles.formRow}>
                <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                <Switch
                    style={styles.formItem}
                    value={this.state.smoking}
                    onTintColor='#512DA8'
                    onValueChange={(value) => this.setState({smoking: value, showDateSelector: false})}>
                </Switch>
            </View>
            <View style={styles.formRow}>
                <Button title='Date and Time'
                style={styles.formLabel}
                onPress={() => this.setState({showDateSelector: true})}
                />
                { this.state.showDateSelector &&
                  <DateTimePicker
                    testID="dateTimePicker"
                    style={{flex: 2, marginRight: 20}}
                    value={todayDate}
                    minimumDate={todayDate}
                    format=''
                    mode="date" //“datetime is iOS only”
                    placeholder="select date and Time"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onConfirm={() => this.setState(prev => ({ ...prev, showDateSelector: false })) }
                    onCancel={() => this.setState(prev => ({ ...prev, showDateSelector: false })) }
                    customStyles={{
                    dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                    },
                    dateInput: {
                        marginLeft: 36
                    }
                    // ... You can check the source to find the other keys. 
                    }}
                    onChange={date => date &&
                        this.setState({
                        date: date['nativeEvent']['timestamp']
                        })}
                /> }
            </View>
            <View style={styles.formRow}>
                <Button
                    // No difference with "this.resetForm()" by now 
                    onPress={() => this.handleReservation()}
                    title="Reserve"
                    color="#512DA8"
                    accessibilityLabel="Learn more about this purple button"
                    />
            </View>
          </ScrollView>
        </Animatable.View>      
        );
    }
};

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 30
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    }
});

export default Reservation;