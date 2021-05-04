let p = document.getElementById("dataText") ;
if (navigator.bluetooth === undefined) {
    p.textContent = "Web bluetooth is not supported" ;
}
else {
    let button = document.getElementById("connectButton") ;
    button.style.cursor = "pointer" ;
    handleCharacteristicValueChanged = (event) => {
        let value = event.target.value ; // a dataviewer object is provided by the object event
        let heartrate = value.getUint8(1) ; // we select the eight bytes that contain the heartrate informations
        p.textContent = heartrate + " BPM" ; // and display it
    }
    onClickEvent = () => {
        navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] }) // we filter the devices, displaying only those with heartrate services
        .then(device => device.gatt.connect()) // after the user select a device, we return the selected one
        .then(server => server.getPrimaryService('heart_rate')) // we get the service
        .then(service => service.getCharacteristic('heart_rate_measurement')) // then the characteristics
        .then(characteristic => characteristic.startNotifications())
        .then(characteristic => {          
            characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged) ; // then we subscribe to the characteristic notifications
        })                                                                                                    // and set the callback function
        .catch(error => { console.error(error); }) ; // we display the errors on the console
    }
    button.addEventListener('click', onClickEvent ) ;
}
