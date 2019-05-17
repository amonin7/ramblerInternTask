import requests
from bs4 import BeautifulSoup
import parser


def get_html(site):
    r = requests.get(site)
    # print(r.text)
    return r.text

def write_html_to_file(html):
    filename = "url2.html"
    myfile = open(filename, 'w')
    myfile.write(html.text)
    myfile.close()


def get_page_data(html):
    soup = BeautifulSoup(html, 'lxml')

    # line = soup.find('div').find('columns').find('section').find('quotes')
    line = soup.find('div', attrs={"class": "columns"}).find('section', attrs={"class": "quotes"}).find_all('article', attrs={"class": "quote"})  # find_all('div', attrs={"class": "quote__body"})

    for article in line:
        # parser.parser(article.find('div', attrs={"class": "quote__body"}))
        print(article.find('div', attrs={"class": "quote__body"}))
        print("----------------------------------------------------\n")
        # print("--------------huihuihuihuihuihuihuihui--------------\n")
        # print("----------------------------------------------------\n")



    # print(line)


def main():
    url = 'https://bash.im/'
    get_page_data(get_html(url))
    # write_html_to_file(get_html(url))
    print('done')


if __name__ == '__main__':
    main()
