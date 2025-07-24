# Die Scan Calculator CLI

A command-line tool to calculate the optimal setup for a line-scan camera system used in industrial inspection, such as die scanning. It helps engineers determine key parameters like camera count, lens focal length, and required line rate based on system specifications.

The tool can be run interactively through a user-friendly terminal interface or non-interactively using command-line arguments for automation and scripting.

## Features

-   **Interactive Mode:** A guided TUI for users who prefer prompts over flags.
-   **Command-Line Arguments:** Full support for command-line flags for easy integration into scripts.
-   **Bilingual Support:** User interface available in both English and Turkish.
-   **Detailed Calculations:** Outputs essential metrics like FOV, magnification, and required line rate.
-   **Practical Tips:** The output table includes a "Notes/Tips" column with design advice for each metric.
-   **JSON Output:** Option to output results in JSON format for easy parsing by other tools.

## Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/keskinonur/harddie
    cd harddie
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Build the project:**
    ```sh
    npm run build
    ```

## Usage

There are two ways to use the Die Scan Calculator: interactive mode or with command-line flags.

### Interactive Mode

To start the interactive prompt, run the `start` script:

```sh
npm start
```

The tool will first ask for your preferred language and then guide you through a series of questions to gather the necessary parameters.

### Non-Interactive (Scripting)

You can also provide parameters directly as command-line arguments. This is useful for scripting or running quick calculations.

**Example:**

```sh
npm start -- --width-mm 1200 --dpi 300 --speed-mm-s 250 --cameras 3
```

### Example Output

Here is a sample output from the tool:

<details>
<summary>Click to see example output</summary>

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│     ____   _         ____                        ____        _          │
│    |  _ \ (_)  ___  / ___|   ___  __ _  _ __    / ___| __ _ | |  ___    │
│    | | | || | / _ \ \___ \  / __|/ _` || '_ \  | |    / _` || | / __|   │
│    | |_| || ||  __/  ___) || (__| (_| || | | | | |___| (_| || || (__    │
│    |____/ |_| \___| |____/  \___|\__,_||_| |_|  \____|\__,_||_| \___|   │
│                                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

INPUTS
┌───────────────────────────────────┬───────────────┬──────────┐
│ Parameter                         │ Value         │ Units    │
├───────────────────────────────────┼───────────────┼──────────┤
│ Object width                      │ 1200.0        │ mm       │
├───────────────────────────────────┼───────────────┼──────────┤
│ Object length (scan)              │ 1200.0        │ mm       │
├───────────────────────────────────┼───────────────┼──────────┤
│ Target DPI                        │ 250.0         │ dpi      │
├───────────────────────────────────┼───────────────┼──────────┤
│ Sensor pixels                     │ 8192          │ px       │
├───────────────────────────────────┼───────────────┼──────────┤
│ Pixel pitch                       │ 7.00          │ µm       │
├───────────────────────────────────┼───────────────┼──────────┤
│ Working distance                  │ 600.0         │ mm       │
├───────────────────────────────────┼───────────────┼──────────┤
│ Traverse speed                    │ 200.0         │ mm/s     │
├───────────────────────────────────┼───────────────┼──────────┤
│ Overlap (total)                   │ 12.0          │ %        │
├───────────────────────────────────┼───────────────┼──────────┤
│ Planned cameras                   │ 2             │ pcs      │
└───────────────────────────────────┴───────────────┴──────────┘
OUTPUTS
┌───────────────────────────────────┬───────────────┬───────────────┬──────────────────────────────────────────────────────────────────────┐
│ Metric                            │ Value         │ Units         │ Notes/Tips                                                           │
├───────────────────────────────────┼───────────────┼───────────────┼──────────────────────────────────────────────────────────────────────┤
│ Pixel size on object              │ 0.1016        │ mm/px         │ Defines the smallest feature you can resolve.                        │
├───────────────────────────────────┼───────────────┼───────────────┼──────────────────────────────────────────────────────────────────────┤
│ Equivalent DPI                    │ 250.0         │ dpi           │ Higher is better, but this is fixed by your choice of DPI.           │
├───────────────────────────────────┼───────────────┼───────────────┼──────────────────────────────────────────────────────────────────────┤
│ Pixels needed across              │ 11811         │ px            │ Total required resolution for the object width.                      │
├───────────────────────────────────┼───────────────┼───────────────┼──────────────────────────────────────────────────────────────────────┤
│ Pixels w/ margin                  │ 13228         │ px            │ Accounts for overlap, giving a safety margin.                        │
├───────────────────────────────────┼───────────────┼───────────────┼──────────────────────────────────────────────────────────────────────┤
│ Cameras required                  │ 2             │ pcs           │ If this seems too high, consider wider-sensor cameras.               │
├───────────────────────────────────┼───────────────┼───────────────┼──────────────────────────────────────────────────────────────────────┤
│ FOV per camera                    │ 672.0         │ mm            │ Check for lens distortion at edges.                                  │
├───────────────────────────────────┼───────────────┼───────────────┼──────────────────────────────────────────────────────────────────────┤
│ Sensor length                     │ 57.344        │ mm            │ Physical size of the camera sensor array.                            │
├───────────────────────────────────┼───────────────┼───────────────┼──────────────────────────────────────────────────────────────────────┤
│ Magnification                     │ 0.0853        │ —             │ Optical mag. < 0.1 or > 10 can be tricky.                            │
├───────────────────────────────────┼───────────────┼───────────────┼──────────────────────────────────────────────────────────────────────┤
│ Lens focal length                 │ 47.2          │ mm            │ Select a standard lens close to this value.                          │
├───────────────────────────────────┼───────────────┼───────────────┼──────────────────────────────────────────────────────────────────────┤
│ Line pitch                        │ 0.102         │ mm/line       │ Distance object moves per scan line (set by DPI).                    │
├───────────────────────────────────┼───────────────┼───────────────┼──────────────────────────────────────────────────────────────────────┤
│ Lines needed (length)             │ 11811         │ lines         │ Total scan lines to cover the object length.                         │
├───────────────────────────────────┼───────────────┼───────────────┼──────────────────────────────────────────────────────────────────────┤
│ Line rate needed                  │ 1968.50       │ Hz            │ Select a camera with at least 2x this rate for margin.               │
└───────────────────────────────────┴───────────────┴───────────────┴──────────────────────────────────────────────────────────────────────┘
```

</details>

## Command-Line Arguments

All parameters can be set via command-line flags.

| Argument           | Description                          | Type    | Default |
| ------------------ | ------------------------------------ | ------- | ------- |
| `--width-mm`       | Object width to cover (mm)           | number  | `1200`  |
| `--length-mm`      | Object length (scan direction) (mm)  | number  | `1200`  |
| `--dpi`            | Target DPI on object                 | number  | `250`   |
| `--sensor-px`      | Camera sensor pixels across width    | number  | `8192`  |
| `--pixel-pitch-um` | Sensor pixel pitch (µm)              | number  | `7`     |
| `--wd-mm`          | Working distance (mm)                | number  | `600`   |
| `--speed-mm-s`     | Traverse speed (mm/s)                | number  | `200`   |
| `--overlap`        | Overlap fraction total (e.g., 0.12)  | number  | `0.12`  |
| `--cameras`        | Planned number of cameras            | number  | `0`     |
| `--json`           | Output results in JSON format        | boolean | `false` |

## License

This project is licensed under the [MIT License](LICENSE).
