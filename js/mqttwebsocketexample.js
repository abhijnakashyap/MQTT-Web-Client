//  Variables
    var WebSocket_MQTT_Broker_URL = "";
    var MQTT_Client_ID = "";
    var MQTT_Topic = "";
    var MQTT_Client = "";


    function mqtt_Connect_with_Broker(){

      // Set variables
      WebSocket_MQTT_Broker_URL = document.getElementById("txt_MQTT_Broker_URL").value;
      MQTT_Client_ID = document.getElementById("txt_MQTT_Client_ID").value;

      // Create a MQTT Client nstance 
      MQTT_Client = new Paho.MQTT.Client(WebSocket_MQTT_Broker_URL, MQTT_Client_ID);

      // set callback handlers
      MQTT_Client.onConnectionLost = onConnectionLost;
      MQTT_Client.onMessageArrived = onMessageArrived;

      MQTT_Client.connect({onSuccess:onConnect});

    }

    // Subscribe to MQTT Topic
    function mqtt_Subscribe_to_Topic(){
      MQTT_Subscribe_Topic = document.getElementById("txt_MQTT_Subscribe_Topic").value;
      MQTT_Client.subscribe(MQTT_Subscribe_Topic);
      Set_New_Console_Msg("Subscribed to MQTT Topic: " + "\"" + MQTT_Subscribe_Topic + "\"" );
    }

    // Send MQTT Message 
    function mqtt_Publish_Message(){
      message = new Paho.MQTT.Message(document.getElementById("txt_MQTT_Msg").value);
      message.destinationName = document.getElementById("txt_MQTT_Publish_Topic").value;
      MQTT_Client.send(message);
      Set_New_Console_Msg("Published " + "\"" + document.getElementById("txt_MQTT_Msg").value + "\"" + "to MQTT Topic: " + "\"" +  document.getElementById("txt_MQTT_Publish_Topic").value + "\"");
    }

    // called when the client connects
    function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
      Set_New_Console_Msg("Connected with MQTT Broker: " + "\"" + document.getElementById("txt_MQTT_Broker_URL").value + "\"");
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        Set_New_Console_Msg("Connection Lost with MQTT Broker. Error: " + "\"" +responseObject.errorMessage + "\"");
      }
    }

    // called when a message arrives
    function onMessageArrived(message) {
      Set_New_Console_Msg("MQTT Message Recieved. "  + " Message: " + "\"" +  message.payloadString + "\"" + " MQTT Topic: " + "\"" + message.destinationName + "\"" + " QoS Value: " + "\"" + message.qos + "\"");
    } 


    // Document Ready Event
    $(document).ready( function() {
      //Set default MQTT Broker WebSocket URL
      document.getElementById("txt_MQTT_Broker_URL").value = "ws://broker.hivemq.com:8000/mqtt";
      //Generate Random MQTT Clinet ID
      gen_MQTT_Client_ID();

    })


    // Set MQTT Messages to TextArea
    function Set_New_Console_Msg(text) {
      document.getElementById("txtAr_Console").value = document.getElementById("txtAr_Console").value + get_Fromatted_Time().toString() + ":  " + text + "\n";
      document.getElementById("txtAr_Console").scrollTop = document.getElementById("txtAr_Console").scrollHeight;
    }

    //Clear Console
    function clear_Console(){
      document.getElementById("txtAr_Console").value = "";
    }

    // Get Formatted time in Hour:Minute:Seconds AM/PM format
    function get_Fromatted_Time() {
      var dt = new Date();
      var hours = dt.getHours() == 0 ? "12" : dt.getHours() > 12 ? dt.getHours() - 12 : dt.getHours();
      var minutes = (dt.getMinutes() < 10 ? "0" : "") + dt.getMinutes();
      var seconds = dt.getSeconds();
      var ampm = dt.getHours() < 12 ? "AM" : "PM";
      var formattedTime = hours + ":" + minutes + ":" + seconds + " " + ampm;
      return formattedTime;
    }

    // Randomly generate Client ID
    function gen_MQTT_Client_ID(){
      document.getElementById("txt_MQTT_Client_ID").value = Math.floor(100000000000 + Math.random() * 900000000000);
    }
