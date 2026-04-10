import requests
from pymongo import MongoClient
from datetime import datetime
import copy
import sys

MONGO_URI = "mongodb+srv://KanishkSanadi:Ludovico@kanishks-cluster.imvlvbw.mongodb.net/Smart-Parking-System?retryWrites=true&w=majority&appName=Kanishks-Cluster"
DB_NAME = "Smart-Parking-System"
COLLECTION_NAME = "ParkingSlots"

THINGSPEAK_CHANNEL_ID = "3108263"
THINGSPEAK_READ_API_KEY = "WJM8MJXS3WVXE3JB"
THINGSPEAK_URL = f"https://api.thingspeak.com/channels/{THINGSPEAK_CHANNEL_ID}/feeds.json?api_key={THINGSPEAK_READ_API_KEY}&results=1"

slot_names = {
    "ground": ["A1", "A2", "A3"],
    "first":  ["B1", "B2", "B3"],
    "second": ["C1", "C2", "C3"]
}

try:
    resp = requests.get(THINGSPEAK_URL, timeout=10)
    resp.raise_for_status()
    ts_data = resp.json()
    latest = ts_data.get("feeds", [])[-1]
except Exception as e:
    print("ERROR: failed to fetch ThingSpeak data:", e)
    sys.exit(1)

free_slots_total   = int(float(latest.get("field1", 0)))
occupied_slots     = int(float(latest.get("field2", 0)))
ground_free        = int(float(latest.get("field3", 0)))
first_free         = int(float(latest.get("field4", 0)))
second_free        = int(float(latest.get("field5", 0)))
cars_entered       = int(float(latest.get("field6", 0)))
cars_exited        = int(float(latest.get("field7", 0)))

ground_list = slot_names["ground"][:ground_free]
first_list  = slot_names["first"] [:first_free]
second_list = slot_names["second"][:second_free]

print("\n--------- THINGSPEAK LIVE DATA ----------")
print("Free slots:", free_slots_total)
print("Occupied slots:", occupied_slots)
print("Ground free:", ground_free, "| Slots:", ground_list)
print("First free:", first_free,   "| Slots:", first_list)
print("Second free:", second_free, "| Slots:", second_list)
print("Cars Entered:", cars_entered, "| Cars Exited:", cars_exited)
print("-----------------------------------------\n")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

orig_doc = collection.find_one({"isMultiLevel": True})
if not orig_doc:
    orig_doc = collection.find_one({"parking": {"$exists": True}})
if not orig_doc:
    print("ERROR: could not find existing parking document.")
    sys.exit(1)

updated_doc = copy.deepcopy(orig_doc)

for idx, level in enumerate(updated_doc["parking"]):
    name = level["levelName"].lower()
    if "ground" in name:
        updated_doc["parking"][idx]["availableParkingSlots"] = ground_list
        updated_doc["parking"][idx]["emptySlots"] = ground_free
        updated_doc["parking"][idx]["occupiedSlots"] = 3 - ground_free

    elif "first" in name:
        updated_doc["parking"][idx]["availableParkingSlots"] = first_list
        updated_doc["parking"][idx]["emptySlots"] = first_free
        updated_doc["parking"][idx]["occupiedSlots"] = 3 - first_free

    elif "second" in name:
        updated_doc["parking"][idx]["availableParkingSlots"] = second_list
        updated_doc["parking"][idx]["emptySlots"] = second_free
        updated_doc["parking"][idx]["occupiedSlots"] = 3 - second_free

update_payload = {
    "parking": updated_doc["parking"],
    "emptySlotsCount": free_slots_total,
    "occupiedSlotsCount": occupied_slots,
#     "lastUpdatedFromThingSpeak": datetime.utcnow()
}

res = collection.update_one({"_id": orig_doc["_id"]}, {"$set": update_payload})

print("MongoDB document updated successfully ")
