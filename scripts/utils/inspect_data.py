import pandas as pd

def inspect_excel():
    file_path = "PREVENT_Inform_Table_V2 (2).xlsx"
    try:
        df = pd.read_excel(file_path)
        print("FULL COLUMN LIST:")
        for i, col in enumerate(df.columns):
            print(f"{i+1}. {col}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_excel()
