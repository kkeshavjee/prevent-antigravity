import pandas as pd
import json

try:
    df = pd.read_excel("../PREVENT_Inform_Table_V2 (2).xlsx")
    # Convert first 2 rows to records to see structure and sample data
    print(json.dumps(df.head(2).to_dict(orient='records'), default=str))
    print("\nColumns:", list(df.columns))
except Exception as e:
    print(e)
