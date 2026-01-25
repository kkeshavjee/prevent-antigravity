import requests
import sys

def test_lookup():
    url = "http://localhost:8000/api/patient/lookup"
    # Try to look up a name that likely exists or just check the schema validation failure
    # Based on data loader, 'User' might be a fallback, or we can look for "Karim" if he's in there.
    # Looking at the code, data_loader.get_patient_by_name case-insensitively checks the Excel.
    # Let's try to pass a name.
    
    params = {"name": "Karim"} 
    
    print(f"Testing {url} with params {params}...")
    try:
        resp = requests.get(url, params=params)
        print(f"Status Code: {resp.status_code}")
        print(f"Response Text: {resp.text}")
    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_lookup()
