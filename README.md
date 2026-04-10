ParqMate – Smart Parking System
  ParqMate is an IoT-based smart parking solution designed to improve parking efficiency through 
  real-time monitoring, automated gate control, and cloud integration. The system provides 
  accurate parking availability updates to both users and administrators.

Key Features
    Automated vehicle detection using IR sensors
    Real-time parking slot availability tracking
    Intelligent gate control using a servo motor
    Continuous monitoring of individual parking slots
    Entry and exit tracking for accurate vehicle count
    Cloud-based data visualization and storage
    Live synchronization with user and admin dashboards
System Workflow
    Vehicle detection using entry IR sensor
    Data processing by ESP32
    Slot availability verification
    Automated gate control based on availability
    Data transmission to cloud platform
    Backend processing and database update
    Real-time dashboard synchronization
Tech Stack
  Hardware
    ESP32 (Wi-Fi enabled microcontroller)
    IR Sensors (9 slot sensors and entry/exit sensors)
    Servo motor for gate automation
  Cloud and IoT
    ThingSpeak for real-time data visualization
    Python for IoT data handling and communication
  Backend and Database
    MongoDB Atlas for cloud database management
    Backend APIs for data processing and integration
  Frontend
    User dashboard for viewing slot availability
    Admin dashboard for monitoring parking activity
    Real-time data synchronization with database
Team Contributions
  Aneesh Chatterjee
    Hardware setup, ESP32 programming, sensor integration, and data transmission
  Nikhil
    Cloud integration, ThingSpeak setup, and Python-based IoT data handling
  Kanishk Sanadi
    Backend development, MongoDB Atlas integration, database management, and frontend dashboards
Conclusion
  ParqMate demonstrates a structured approach to smart parking by integrating embedded systems, cloud computing,
  and full-stack development. The project highlights the importance of coordination across hardware, software,
  and cloud domains to build scalable IoT solutions.
