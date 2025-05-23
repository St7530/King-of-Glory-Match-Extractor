# King-of-Glory-Match-Extractor
Automatically extract match data from pvp.qq.com

## Data included

- league name
- start time
- battle round
- win camp
- kill num
- gold
- ban list
- pick list

## How to use

### Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) on your browser.
2. [Click this link](https://github.com/St7530/King-of-Glory-Match-Extractor/raw/refs/heads/main/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80%E8%B5%9B%E4%BA%8B%E6%95%B0%E6%8D%AE%E6%8F%90%E5%8F%96-0.1.0.js) to install the script in Tampermonkey.
3. Install [Python](https://www.python.org/downloads/) on your system.
4. Install the `flask` dependency by `pip install flask`.

### Usage

1. Run the Python program in a particular directory.
2. Visit http://127.0.0.1:5000/init in order to create and initialize the `output.csv` file in that directory.
3. Open a league page (for example, https://pvp.qq.com/matchdata/schedule.html?league_id=20250001)
4. Open the first match data (for example, https://pvp.qq.com/matchdata/scheduleDetails.html?league_id=20250001&match_id=2025021201)
5. Then you'll find the page jumping automatically, the Console in DevTools outputting all the data, which will be saved in the `output.csv` file.

## How I build this

1. Analyse the key JavaScript code: https://pvp.qq.com/matchdata/js/scheduleDetails.js ([Archived](scheduleDetails.js))
2. Develop a UserScript that processes all the data and automatically jumps to the next battle or match.
3. Develop a simple Python backend that saves the data to a CSV file.

## License

[The MIT License](LICENSE)
