# King-of-Glory-Match-Extractor
Automatically extract match data from pvp.qq.com

## Data Included

- league name
- start time
- battle round
- win camp
- kill num
- gold
- ban list
- pick list

All the data will be saved as a `.csv` file like this:
```
赛事,时间,局数,胜利方,蓝方人头,红方人头,蓝方经济,红方经济,角色1,角色2,角色3,角色4,角色5,角色6,角色7,角色8,角色9,角色10,角色11,角色12,角色13,角色14,角色15,角色16,角色17,角色18,角色19,角色20
2025年KPL春季赛,02-12 14:00,第一局,蓝方,14,3,55889,47999,安琪拉,孙策,不知火舞,夏洛特,杨玉环,公孙离,元流之子(坦克),姬小满,百里守约,墨子,鲁班大师,关羽,少司缘,孙尚香,沈梦溪,朵莉亚,夏侯惇,马超,嬴政,张良
2025年KPL春季赛,02-12 14:00,第二局,红方,5,10,61499,59552,典韦,关羽,元流之子(坦克),镜,蒙恬,鲁班大师,鲁班七号,露娜,狄仁杰,嫦娥,夏侯惇,猪八戒,少司缘,敖隐,阿古朵,廉颇,不知火舞,狂铁,孙策,张良
2025年KPL春季赛,02-12 14:00,第三局,红方,13,12,73031,73663,孙策,沈梦溪,甄姬,不知火舞,安琪拉,朵莉亚,戈娅,司空震,明世隐,大司命,敖隐,亚连,少司缘,鲁班大师,夏洛特,元流之子(坦克),孙尚香,女娲,关羽,张良
2025年KPL春季赛,02-12 14:00,第四局,蓝方,12,6,40106,32645,孙策,姬小满,蒙恬,后羿,狂铁,太乙真人,敖隐,苍,王昭君,甄姬,梦奇,影,鲁班大师,女娲,典韦,镜,张良,夏洛特,孙尚香,关羽
2025年KPL春季赛,02-12 14:00,第五局,蓝方,9,4,52638,47044,司空震,大司命,甄姬,蒙恬,沈梦溪,太乙真人,梦奇,亚连,马超,虞姬,公孙离,关羽,少司缘,孙尚香,安琪拉,苍,大乔,影,墨子,鲁班大师
```

## How to Use

### Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) on your browser.
2. [Click this link](https://github.com/St7530/King-of-Glory-Match-Extractor/raw/refs/heads/main/King-of-Glory-Match-Extractor-user.js) to install the script in Tampermonkey.

   In case that Tampermonkey doesn't pop up to help you install the script, you need to **create a script** in Tampermonkey, select all, **paste the `.js` code** to it, and **save** by yourself.
3. Install [Python](https://www.python.org/downloads/) on your system.
4. Install the `flask` dependency by `pip install flask`.

### Usage

1. Download and run the Python program `King-of-Glory-Match-Extractor-backend.py` in a particular directory.
2. Visit http://127.0.0.1:5000/init in order to create and initialize the `output.csv` file in that directory.
3. Open a league page (for example, https://pvp.qq.com/matchdata/schedule.html?league_id=20250001)
4. Open the first match data (for example, https://pvp.qq.com/matchdata/scheduleDetails.html?league_id=20250001&match_id=2025021201)
5. Then you'll find the page jumping automatically, the Console in DevTools outputting all the data, which will be saved in the `output.csv` file.

## How I Build This

1. Analyse the key JavaScript code: https://pvp.qq.com/matchdata/js/scheduleDetails.js ([Archived](Archived/scheduleDetails.js))
2. Develop a UserScript that processes all the data and automatically jumps to the next battle or match.
3. Develop a simple Python backend that receives and saves the data to a CSV file.

## License

[The MIT License](LICENSE)
