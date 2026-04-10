#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>

// ================= LCD ==================
LiquidCrystal_I2C lcd(0x27, 16, 2); // change 0x27 if your LCD has different I2C address

// ================= Wi-Fi =================
const char* ssid     = "ICN 1st floor 4";
const char* password = "Akash@445";

// ================= ThingSpeak =================
String apiKey = "WJM8MJXS3WVXE3JB";
const char* server = "http://api.thingspeak.com/update";

// ================= Servo =================
Servo gateServo;

// ================= IR Sensors =================
#define ENTRY_IR 32
#define EXIT_IR  33

// ================= Slot Pins =================
// 3 slots per floor (example mapping)
int groundPins[3] = {4, 5, 12};
int floor1Pins[3] = {13, 14, 15};
int floor2Pins[3] = {19, 21, 22};

// ================= Counters =================
int totalSlots = 9;
int freeSlots  = 9;
int occupiedSlots = 0;
int groundFree = 0;
int floor1Free = 0;
int floor2Free = 0;
int carsEntered = 0;
int carsExited = 0;

// ================= Setup =================
void setup() {
  Serial.begin(115200);

  // LCD
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print(" Smart Parking ");
  lcd.setCursor(0, 1);
  lcd.print("System Loading..");
  delay(2000);

  // Servo
  gateServo.attach(18);
  gateServo.write(0); // keep gate closed initially

  // Sensors
  pinMode(ENTRY_IR, INPUT);
  pinMode(EXIT_IR, INPUT);

  for (int i = 0; i < 3; i++) {
    pinMode(groundPins[i], INPUT);
    pinMode(floor1Pins[i], INPUT);
    pinMode(floor2Pins[i], INPUT);
  }

  // Wi-Fi
  WiFi.begin(ssid, password);
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("WiFi Connected");
  delay(1000);
}

// ================= Loop =================
void loop() {
  // Count free slots per floor
  groundFree = countFreeSlots(groundPins);
  floor1Free = countFreeSlots(floor1Pins);
  floor2Free = countFreeSlots(floor2Pins);

  freeSlots = groundFree + floor1Free + floor2Free;
  occupiedSlots = totalSlots - freeSlots;

  // Entry detection
  if (digitalRead(ENTRY_IR) == LOW && freeSlots > 0) {
    openGate();
    carsEntered++;
    delay(2000);  // debounce
  }

  // Exit detection
  if (digitalRead(EXIT_IR) == LOW && occupiedSlots > 0) {
    openGate();
    carsExited++;
    delay(2000);  // debounce
  }

  // Update LCD
  displayStatus();

  // Push data to ThingSpeak
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = server;
    url += "?api_key=" + apiKey;
    url += "&field1=" + String(freeSlots);      // Total free slots
    url += "&field2=" + String(occupiedSlots);  // Occupied slots
    url += "&field3=" + String(groundFree);     // Ground floor free slots
    url += "&field4=" + String(floor1Free);     // Floor1 free slots
    url += "&field5=" + String(floor2Free);     // Floor2 free slots
    url += "&field6=" + String(carsEntered);    // Cars entered
    url += "&field7=" + String(carsExited);     // Cars exited

    http.begin(url);
    int httpCode = http.GET();
    if (httpCode > 0) {
      Serial.println("✅ Data sent to ThingSpeak");
    } else {
      Serial.println("❌ Error sending data");
    }
    http.end();
  }

  delay(15000); // update every 15 seconds (ThingSpeak free limit)
}

// ================= Functions =================
int countFreeSlots(int slotArray[3]) {
  int count = 0;
  for (int i = 0; i < 3; i++) {
    if (digitalRead(slotArray[i]) == HIGH) count++;
  }
  return count;
}

void openGate() {
  gateServo.write(90);  // open
  delay(2000);
  gateServo.write(0);   // close
}

void displayStatus() {
  lcd.clear();
  lcd.setCursor(0, 0);
  if (freeSlots == 0) {
    lcd.print("PARKING FULL!");
    lcd.setCursor(0, 1);
    lcd.print("Free: 0");
  } else {
    lcd.print("Free:");
    lcd.print(freeSlots);
    lcd.print(" Occ:");
    lcd.print(occupiedSlots);
  }
}
