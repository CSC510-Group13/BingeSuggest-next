import pandas as pd
import os
from imdb import IMDb
from concurrent.futures import ThreadPoolExecutor

# Initialize IMDb instance globally to reduce overhead
ia = IMDb()
i = 0


def get_imdb_rating(imdb_id):
    global i
    i += 1
    print(i)
    if i % 10 == 0:
        os.system("cls" if os.name == "nt" else "clear")

    try:
        movie = ia.get_movie(imdb_id[2:])  # Removing 'tt' prefix
        rating = movie.get("rating", "No Rating Found")
        return rating
    except Exception as e:
        print(f"Error fetching data for IMDb ID {imdb_id}: {e}")
        return "Error", "Error"


def update_csv_with_rating(file_path):
    # Load the CSV file
    df = pd.read_csv(file_path)

    # Ensure 'imdb_id' column exists
    if "imdb_id" not in df.columns:
        print("Error: 'imdb_id' column not found in the CSV file.")
        return

    df = df.drop_duplicates(subset="title", keep="first")

    # Check if 'rating' column exist; if not, add it
    if "rating" not in df.columns:
        df["rating"] = None

    # Filter rows where rating or awards are still missing
    imdb_ids_to_fetch = df[df["rating"].isnull()]["imdb_id"].tolist()

    # Fetch rating and awards details concurrently for missing entries
    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(get_imdb_rating, imdb_ids_to_fetch))

    df.loc[df["rating"].isnull(), "rating"] = results

    # Save the updated DataFrame back to the CSV
    df.to_csv(file_path, index=False)
    print(f"Updated CSV saved with IMDb ratings in '{file_path}'.")


# Usage example
csv_file_path = r".\data\movies.csv"  # Replace with your file path
update_csv_with_rating(csv_file_path)
