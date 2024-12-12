#include <Wire.h>
#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <Adafruit_BMP280.h>
#include <SPI.h>
#include "DHT.h"

// Pins and Settings
#define DHTPIN 13
#define PPMPIN 39
#define DHTTYPE DHT22
#define WIFI_RECONNECT_TIMEOUT 10000 // 10 seconds

const char* ssid = "<WIFI-UUID>";
const char* password = "<WIFI-PASSWORD>";
const char *api_key = "<API-KEY>"; // same as set on vercel

//Your Domain name with URL path or IP address with path
const char* serverName = "<VERCEL-ENDPOINT-URL>";

WiFiClientSecure* client = new WiFiClientSecure;
DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP280 bmp;

// Timing Variables
unsigned long lastTime = 0;
unsigned long timerDelay = 1 * 60 * 1000;  // 1 minute

// Function Prototypes
void initializeSensors();
bool ensureWiFiConnected();
void logAndSendSensorData();
void logSensorReadings(float h, float meanTemp, float pressure, int ppm);
void sendDataToServer(float temperature, float humidity, float pressure, int airQuality);

// * MAIN SETUP
void setup() {
  Serial.begin(115200);
  Wire.begin(25, 26);
  initializeSensors();

  // WiFi Initialization
  WiFi.mode(WIFI_STA);
  ensureWiFiConnected();
}

// * MAIN LOOP
void loop() {
  delay(2000);
  
  // Reconnect if necessary
  if (!ensureWiFiConnected()) {
    return;
  }

  // Log and send data periodically
  if ((millis() - lastTime) > timerDelay) {
    logAndSendSensorData();
    lastTime = millis();
  }
}

// --- Utility Functions ---

// Initialize Sensors
void initializeSensors() {
  dht.begin();
  if (!bmp.begin(0x76)) {
    Serial.println(F("Could not find a valid BMP280 sensor, check wiring or try a different address!"));
    while (1) delay(10); // Halt if sensor initialization fails
  }

  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */
}

// Ensure WiFi is connected
bool ensureWiFiConnected() {
  if (WiFi.status() == WL_CONNECTED) {
    return true;
  }

  Serial.println("WiFi Disconnected. Attempting to reconnect...");
  WiFi.begin(ssid, password);
  unsigned long startAttemptTime = millis();

  // Attempt reconnection for a limited time
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < WIFI_RECONNECT_TIMEOUT) {
    Serial.print(".");
    delay(500);
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nReconnected to WiFi!");
    Serial.println(WiFi.localIP());
    return true;
  } else {
    Serial.println("\nFailed to reconnect to WiFi.");
    return false;
  }
}

// Read sensors and log/send data
void logAndSendSensorData() {
  int ppm = analogRead(PPMPIN);
  float h = dht.readHumidity();
  float dhtTemp = dht.readTemperature();
  float bmpTemp = bmp.readTemperature();
  float pressure = bmp.readPressure() / 100.0F; // Convert Pa to hPa
  float meanTemp = (dhtTemp + bmpTemp) / 2.0;   // Mean temperature

  // Validate sensor readings
  if (isnan(h) || isnan(dhtTemp) || isnan(bmpTemp) || isnan(pressure)) {
    Serial.println(F("Sensor read failed!"));
    return;
  }

  logSensorReadings(h, meanTemp, pressure, ppm);
  sendDataToServer(meanTemp, h, pressure, ppm);
}

// Log sensor readings to Serial Monitor
void logSensorReadings(float h, float meanTemp, float pressure, int ppm) {
  Serial.println("Air Quality (PPM): " + String(ppm));
  Serial.println("Humidity: " + String(h) + " %");
  Serial.println("Temperature: " + String(meanTemp) + " *C");
  Serial.println("Pressure: " + String(pressure) + " hPa");
}

// Send sensor data to server
void sendDataToServer(float temperature, float humidity, float pressure, int airQuality) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Disconnected");
    return;
  }

  client->setInsecure();

  HTTPClient https;
  https.begin(*client, serverName);
  https.addHeader("Content-Type", "application/json");

  // Prepare JSON payload
  String jsonRequest = "{\"apiKey\":\"" + String(api_key) +
                       "\",\"temperature\":" + String(temperature) +
                       ",\"humidity\":" + String(humidity) +
                       ",\"pressure\":" + String(pressure) +
                       ",\"airQuality\":" + String(airQuality) + "}";

  // Send HTTP POST request
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

  https.end(); // Free resources
}
