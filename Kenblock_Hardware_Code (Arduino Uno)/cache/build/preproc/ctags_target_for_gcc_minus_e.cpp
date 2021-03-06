# 1 "C:\\Users\\prana\\Documents\\sketch_jul12a\\cache\\sketch_jul12a.ino"
# 1 "C:\\Users\\prana\\Documents\\sketch_jul12a\\cache\\sketch_jul12a.ino"
/**
 * Copyright(C), 2018-2038, KenRobot.com
 * FileName: sketch_jul12a.ino
 * Author: 啃萝卜
 * Create: 2019/07/19
 * Modify: 2019/07/19
 */

# 10 "C:\\Users\\prana\\Documents\\sketch_jul12a\\cache\\sketch_jul12a.ino" 2
# 11 "C:\\Users\\prana\\Documents\\sketch_jul12a\\cache\\sketch_jul12a.ino" 2
# 12 "C:\\Users\\prana\\Documents\\sketch_jul12a\\cache\\sketch_jul12a.ino" 2

int alcoholSensor_A_0 = A7;
FourDigitalDisplay disp_0((0x03));
int infraredSwitch_0 = 2;
int infraredSwitch_1 = A3;
int led_0 = A0;
int led_1 = A1;
Motor motor_1((0x01));
int peopleInHouse;
uint32_t secretKey;
uint32_t inputtedNumber;
bool personDetected0;
bool personDetected1;
bool infraActive0;
bool infraActive1;
bool openGateWhenInProximity;
bool alcoholMode;
void handleInfra0() {
    if (digitalRead(infraredSwitch_0) == 0x1) {
        infraActive0 = false;
    } else {
        if (infraActive0 == false) {
            personDetected0 = !personDetected0;
            if ((personDetected0) && (personDetected1)) {
                personDetected0 = false;
                personDetected1 = false;
                if (peopleInHouse > 0) {
                    peopleInHouse = (peopleInHouse - 1);
                }
            }
        }
        infraActive0 = true;
    }
}
void handleInfra1() {
    if (digitalRead(infraredSwitch_1) == 0x1) {
        infraActive1 = false;
    } else {
        if (infraActive1 == false) {
            personDetected1 = !personDetected1;
            if ((personDetected0) && (personDetected1)) {
                personDetected0 = false;
                personDetected1 = false;
                peopleInHouse = (peopleInHouse + 1);
                disp_0.display(peopleInHouse);
                powerSwitch();
                if (openGateWhenInProximity) {
                    Serial.write(50);
                    openGateWhenInProximity = false;
                    gateOpen(true);
                    delay(6000);
                    gateOpen(false);
                }
            }
        }
        infraActive1 = true;
    }
}
void gateOpen(bool open) {
    if (open) {
        motor_1.run(((100)>0?(100):-(100)));
        motor_1.run(-((100)>0?(100):-(100)));
    } else {
        motor_1.run(-((100)>0?(100):-(100)));
        motor_1.run(((100)>0?(100):-(100)));
    }
    delay(300);
    motor_1.stop();
    motor_1.stop();
}
void powerSwitch() {
    if (peopleInHouse > 0) {
        digitalWrite(led_0, 0x1);
    } else {
        digitalWrite(led_0, 0x0);
    }
}
void reset() {
    peopleInHouse = 0;
    infraActive0 = false;
    infraActive1 = false;
    personDetected0 = false;
    personDetected1 = false;
    openGateWhenInProximity = false;
    disp_0.clearDisplay();
    digitalWrite(led_1, 0x0);
    digitalWrite(led_0, 0x0);
}

void setup() {
    Serial.begin(9600);
    pinMode(infraredSwitch_0, 0x2);
    pinMode(infraredSwitch_1, 0x2);
    pinMode(led_0, 0x1);
    pinMode(led_1, 0x1);
    peopleInHouse = 0;
    secretKey = 56781;
    inputtedNumber = 0;
    infraActive0 = false;
    infraActive1 = false;
    personDetected0 = false;
    personDetected1 = false;
    openGateWhenInProximity = false;
    alcoholMode = true;
}

void loop() {
    if (alcoholMode) {
        disp_0.display((analogRead(alcoholSensor_A_0) % 100));
        if ((analogRead(alcoholSensor_A_0) % 100) > 30) {
            digitalWrite(led_0, 0x1);
            digitalWrite(led_1, 0x0);
        } else {
            digitalWrite(led_1, 0x1);
            digitalWrite(led_0, 0x0);
        }
    } else {
        handleInfra0();
        handleInfra1();
        powerSwitch();
        disp_0.display(peopleInHouse);
    }
    if (Serial.available() > 0) {
        int value = Serial.read();
        inputtedNumber = (inputtedNumber * 10) + (value - '0');
        if (inputtedNumber >= 10000) {
            if (inputtedNumber == 10002) {
                openGateWhenInProximity = true;
                Serial.write(52);
            } else if (inputtedNumber == secretKey) {
                if (alcoholMode) {
                    Serial.write(53);
                } else {
                    Serial.write(54);
                }
            } else if (inputtedNumber == 10003) {
                alcoholMode = !alcoholMode;
                reset();
                Serial.write(51);
            } else if (inputtedNumber == 10004) {
                Serial.write(50);
                gateOpen(true);
                delay(6000);
                gateOpen(false);
            } else {
                Serial.write(48);
            }
            inputtedNumber = 0;
        }
    }

}
