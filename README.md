# 👶 Smart Baby Monitoring System  

An **IoT-based smart baby monitoring system** designed to help parents and guardians monitor a baby’s environment and receive timely alerts about safety conditions.

---

## 📌 Project Overview  

The Smart Baby Monitoring System uses **IoT sensors**, a **cloud data platform**, and a **web dashboard** to continuously track environmental and activity-related parameters around a baby. The system visualizes real-time sensor data and notifies parents when values cross predefined safety thresholds.

This project was developed as an **IoT mini project** with scope for future expansion.
Link: https://baby-hug-monitor.lovable.app

---

## 🚀 Features  

- 📡 Real-time monitoring of baby’s environment  
- 🌡️ Tracks temperature and humidity  
- 🌫️ Monitors air quality  
- 🔊 Detects sound levels  
- 📈 Live and historical data visualization on a web dashboard  
- ☁️ Cloud integration using **ThingSpeak API**  
- 🔔 Alerts parents/guardians when unsafe conditions are detected  

---

## 🛠️ Tech Stack  

### Hardware  
- ESP32 Microcontroller  
- Temperature & Humidity Sensor  
- Gas / Air Quality Sensor  
- Sound Sensor  
- Motion / Vibration Sensor  

### Software & Platforms  
- Arduino IDE  
- ThingSpeak Cloud Platform  
- Web Dashboard (Frontend + Backend)  
- REST APIs for data fetching and visualization  

---

## 🧠 System Architecture  

1. Sensors collect environmental and activity data  
2. ESP32 processes and uploads data to ThingSpeak using API keys  
3. ThingSpeak stores and visualizes sensor data  
4. Web dashboard fetches data from ThingSpeak APIs  
5. Alert logic checks threshold values and notifies parents  

---

## 📊 Dashboard  

- Displays real-time sensor readings  
- Shows historical graphs for better analysis  
- Provides clear status updates about the baby’s condition  

---

## 🔔 Alerts & Notifications  

The system notifies parents/guardians when:
- Temperature or humidity exceeds safe limits  
- Air quality degrades  
- Unusual sound or motion is detected  

This helps ensure **quick attention and safety awareness**.

---

## 🧪 Testing  

- Tested end-to-end on a **local host environment**  
- Verified sensor data upload, cloud storage, dashboard visualization, and alert triggering  

---

## 🔮 Future Scope  

- Integration with a **smart baby cot**  
- Voice-assistant support (e.g., Alexa or similar)  
- Automated responses like music, toys, or alerts  
- Mobile app integration  

*(Future scope not implemented in current version)*

---



---

## 📄 License  

This project is for academic and learning purposes.
