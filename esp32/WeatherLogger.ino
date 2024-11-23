#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include "DHT.h"

#define DHTPIN 13

#define DHTTYPE DHT22  // DHT 22  (AM2302), AM2321

DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "<WIFI-UUID>";
const char* password = "<WIFI-PASSWORD>";
const char *api_key = "<API-KEY>"; // same as set on vercel

//Your Domain name with URL path or IP address with path
String serverName = "<VERCEL-ENDPOINT-URL>";

unsigned long lastTime = 0;
unsigned long timerDelay = 1 * 60 * 1000; // 1 minute

void setup() {
  Serial.begin(115200);

  if (ssid == "<WIFI-UUID>" || password == "<WIFI-PASSWORD>" || api_key == "<API-KEY>" || serverName == "<VERCEL-ENDPOINT-URL>") {
    Serial.println("Please set the ssid, password, api_key and serverName");
    return;
  }

  dht.begin();

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  WiFiClientSecure *client = new WiFiClientSecure;
  
  delay(2000);

  if ((millis() - lastTime) > timerDelay && client) {
    float h = dht.readHumidity();

    // Read temperature as Celsius (the default)
    float t = dht.readTemperature();

    // Check if any reads failed and exit early (to try again).
    if (isnan(h) || isnan(t)) {
      Serial.println(F("Failed to read from DHT sensor!"));
      return;
    }

    if (WiFi.status() == WL_CONNECTED) {
      client->setInsecure();
      HTTPClient https;

      // Your Domain name with URL path or IP address with path
      https.begin(*client, serverName.c_str());
      https.addHeader("Content-Type", "application/json");

      String jsonRequest = "{\"apiKey\":\"" + String(api_key) + "\",\"temperature\":" + String(t) + ",\"humidity\":" + String(h) + "}";

      // Send HTTP GET request
      int httpResponseCode = https.POST(jsonRequest);

      if (httpResponseCode > 0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = https.getString();
        Serial.println(payload);
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }

      // Free resources
      https.end();
    } else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}