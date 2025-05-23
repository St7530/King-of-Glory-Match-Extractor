# 王者荣耀赛事数据提取 后端
from flask import Flask, request, jsonify, make_response
import csv
app = Flask(__name__)

@app.route('/data', methods=['POST', 'OPTIONS'])
def receive_data():
    if request.method == 'OPTIONS': # 处理预检请求
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, X-Requested-With")
        return response

    elif request.method == 'POST':
        data = request.get_json()

        with open('output.csv', mode='a', encoding='utf-8-sig', newline='') as file:
            csv_writer = csv.writer(file)   

            row = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
            row[0] = data['league']
            row[1] = data['time']
            row[2] = data['game']
            row[3] = data['win']
            row[4] = data['camp1']['kill']
            row[5] = data['camp2']['kill']
            row[6] = data['camp1']['gold']
            row[7] = data['camp2']['gold']
            for i in range(1,21):
                row[7+i] = data['hero'][i-1]
            print(row)

            csv_writer.writerow(row)

        response = jsonify({"message": "Data received"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

@app.route("/init")
def init_data(): # 清空数据并写入 CSV 表头
    with open('output.csv', mode='w', encoding='utf-8-sig', newline='') as file:
            fieldnames = ['赛事', '时间', '局数', '胜利方', '蓝方人头', '红方人头', '蓝方经济', '红方经济', '角色1', '角色2', '角色3', '角色4', '角色5', '角色6', '角色7', '角色8', '角色9', '角色10', '角色11', '角色12', '角色13', '角色14', '角色15', '角色16', '角色17', '角色18', '角色19', '角色20']
            csv_dict_writer = csv.DictWriter(file,fieldnames)
            csv_dict_writer.writeheader()
    return "Data initialized!"

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run(debug=True)