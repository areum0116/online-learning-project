from selenium import webdriver
from selenium.common.exceptions import WebDriverException as WDE
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import time
import pandas as pd
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# options = webdriver.ChromeOptions()
# options.add_argument('headless')

def from_string_to_num(str):
    isK = False; isM = False
    if 'K' in str: isK = True
    elif 'M' in str: isM = True
    str = str.replace('K', '').replace('M', '')
    isFloat = True if '.' in str else False
    str = float(str) if isFloat else int(str)
    if isK: str = str * 1000
    elif isM: str = str * 1000000
    return str

# 스크롤을 어디까지 내리는지 기준    
finish_line = 40000

browser = webdriver.Chrome() 
browser.maximize_window()

present_url = 'https://www.youtube.com/results?search_query=%EC%B4%88%EB%93%B1+%EC%88%98%ED%95%99'
browser.get(present_url)
time.sleep(2)

# 원하는 위치 스크롤 내리기
last_page_height = browser.execute_script("return document.documentElement.scrollHeight")

while True:
    # 우선 스크롤 내리기
    browser.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
    time.sleep(2.0)       # 작업 중간에 1이상으로 간격을 줘야 데이터 취득가능(스크롤을 내릴 때의 데이터 로딩 시간 때문)
    # 현재 위치 담기
    new_page_height = browser.execute_script("return document.documentElement.scrollHeight")
    
    # 과거의 길이와 현재 위치 비교하기
    if new_page_height > finish_line:
        break
    else: 
        last_page_height = new_page_height

html_source = browser.page_source
soup = BeautifulSoup(html_source, 'lxml')

# finish line까지 모든 검색 결과 정보 가져오기
# 모든 컨텐츠 관련 부분을 떼어내기
# find_all: 해당 정보의 모든 부분 가져오기
elem = soup.find_all("ytd-video-renderer", attrs={"class":'style-scope ytd-item-section-renderer'})
# 필요한 정보 가져오기
df = []
img_num = 0
for t in elem:
    try:
        title = t.find("yt-formatted-string", attrs={"class":'style-scope ytd-video-renderer'}).get_text()
        title = title.replace(",", "/")
        channel = t.find("a", attrs={"class":'yt-simple-endpoint style-scope yt-formatted-string'})
        channel_url = channel["href"]
        channel = channel.get_text()

        url = t.find("a", attrs={"class":'yt-simple-endpoint style-scope ytd-video-renderer'})["href"]
        img = t.find("yt-image", attrs={"class":"style-scope ytd-thumbnail"})
        img_num = img_num + 1
        if img.img.has_attr("src"):
            img_url = img.img["src"]
        else:
            img_url = f'https://source.unsplash.com/random/430×230/?study[{img_num}]'

        view_cnt_text = t.find("div", attrs={"id":'metadata-line'}).span.get_text()
        if view_cnt_text == 'No views':
            view_cnt = 0
        else:
            view_cnt = view_cnt_text.replace('views','').replace(',','')
            view_cnt = from_string_to_num(view_cnt)

        upload_date = t.find_all("span", attrs={"class":'inline-metadata-item style-scope ytd-video-meta-block'})[1].get_text()
        

        description = ''
        descriptions = t.find("yt-formatted-string", attrs={"class", 'metadata-snippet-text style-scope ytd-video-renderer'})
        if descriptions is not None:
            descriptions = descriptions.find_all("span")
            for d in descriptions:
                description = description + d.get_text()
        description = description.replace(",", "/")

        df.append([title, channel, 'https://www.youtube.com/'+url, img_url, view_cnt, upload_date, description, 'https://www.youtube.com/'+channel_url])
    except Exception as e :
        print('error!', e)

ch_url = {}
for row in df:
    ch_url[row[1]] = row[7]
ch_url = list(ch_url.items())

ch_info = {}

for url in ch_url:
    try:
        browser.get(url[1])
        time.sleep(2)
        soup = BeautifulSoup(browser.page_source, 'lxml')
        temp = soup.find_all("yt-formatted-string", attrs={"class", 'style-scope ytd-c4-tabbed-header-renderer'})
        sub_num = temp[2].get_text().split(' ')[0]
        sub_num = from_string_to_num(sub_num)
        tot_vid = temp[3].span.get_text()
        tot_vid = from_string_to_num(tot_vid)
        print(sub_num, ',',tot_vid)
        ch_info[url[0]] = [sub_num, tot_vid]
    except Exception as e :
        print('error!', e)

for i in range(len(df)):
    df[i].append(ch_info[df[i][1]][0])
    df[i].append(ch_info[df[i][1]][1])
    df[i].append(i)

## 자료 저장
# 데이터 프레임 만들기
new = pd.DataFrame(columns=['title', 'channel' , 'url', 'img_url', 'view_cnt', 'upload_date', 'description', 'channel_url', 'subscribers', 'total_vid', 'num'])

# 자료 집어넣기
for i in range(len(df)):
    new.loc[i] = df[i]

# 저장하기
# 현재 작업폴더 안의 data 폴더에 저장
df_dir = "./data/" # 저장할 디렉토리
new.to_csv(df_dir+"Youtube_search_df.csv", index=False, encoding='utf8')

# 브라우저 닫기
browser.close()  

