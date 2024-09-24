import os
import pandas as pd
import json
from concurrent.futures import ProcessPoolExecutor

# Set the number of OpenMP threads to 1
os.environ["OMP_NUM_THREADS"] = "1"


# Define the processing function for a single file
def process_single_file(input_file_path, output_file_path):
    # Read the feather file into a pandas DataFrame
    df = pd.read_feather(input_file_path)

    # Filter rows where is_valid is True
    valid_rows = df[df["is_valid"]]

    # Extract the 3D positions and truncate floats to 3 decimal places
    positions = (
        valid_rows[["flow_tx_m", "flow_ty_m", "flow_tz_m"]]
        .apply(lambda x: x.round(3), axis=1)
        .values.tolist()
    )

    # Save the positions as a JSON file
    with open(output_file_path, "w") as json_file:
        raw_str = json.dumps(
            json.loads(
                json.dumps(positions, default=str),
                parse_float=lambda x: round(float(x), 3),
            )
        )
        json_file.write(raw_str)

    print(f"Processed and saved: {output_file_path}")


# Define the main function to process all feather files in parallel using processes
def process_feather_files_parallel(input_dir, output_dir, max_workers=4):
    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # List and sort feather files in the input directory
    feather_files = sorted([f for f in os.listdir(input_dir) if f.endswith(".feather")])

    # Create the ProcessPoolExecutor to parallelize the processing
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        futures = []
        for file_name in feather_files:
            input_file_path = os.path.join(input_dir, file_name)

            # Create the output file path by changing the extension to .json
            output_file_name = file_name.replace(".feather", ".json")
            output_file_path = os.path.join(output_dir, output_file_name)

            # Submit the processing of each file to the executor
            futures.append(
                executor.submit(process_single_file, input_file_path, output_file_path)
            )

        # Wait for all the futures to complete
        for future in futures:
            future.result()  # This will re-raise any exceptions that occurred during processing

    print("All files have been processed.")


# Set the input and output directories
input_directory = "/efs/orbbec_pointclouds/pointclouds-spinning_flow/LoaderType.NON_CAUSAL/sequence_len_069/pointclouds-spinning/000000/"
output_directory = "/efs/orbbec_pointclouds/pointclouds-spinning_flow/"

# Call the function to process the files with parallelization
process_feather_files_parallel(input_directory, output_directory, max_workers=40)
