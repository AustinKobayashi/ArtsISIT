import os
import codecs
import xml.etree.ElementTree as ET




def PrintText(text_root):
    text = ''
    first_s = True
    last_was_c = False
    for attribute in text_root.iter('*'):
        if attribute.tag == 's' and not first_s:
            break

        first_s = False

        if attribute.tag == 'w' and attribute.text is not None:
            text += attribute.text
            last_was_c = False

        if attribute.tag == 'c' and attribute.text is not None and not last_was_c:
            text += attribute.text + ' '
            last_was_c = True
        elif attribute.tag == 'c' and attribute.text is not None and last_was_c:
            text = text[0:len(text) - 1] + attribute.text + ' '
            last_was_c = True

    return text


def open_and_save_text(path, name):

    tree = ET.parse(path)
    root = tree.getroot()
    full_text = ''
    is_title = False
    for neighbor in root.iter('*'):
        if neighbor.tag == 's':
            full_text += PrintText(neighbor)

        if is_title:
            full_text += '\r\n'
            is_title = False

        if neighbor.tag == 'head':
            full_text += '\r\n'
            is_title = True

    # file = open('texts/' + name + '.txt', 'w')
    # file.write(full_text.encode('utf-8'))
    # file.close()
    #print(full_text)
    try:
        with codecs.open('texts/' + name, 'w', encoding='utf8') as f:
            f.write(full_text)
    except TypeError:
        print(name)
        print(full_text)
        with codecs.open('texts/' + name, 'w', encoding='utf8') as f:
            f.write(full_text)

#open_and_save_text('C:\\Users\\akobs\\Downloads\\2554\\2554\\download\Texts\A\A0\A00.xml', 'A00')


def convert_all_xml_to_txt():
    base_path = 'C:\\Users\\akobs\\Downloads\\2554\\2554\\download\Texts'
    for root, dirs, files in os.walk(base_path):
        for name in files:
            #print(root + '\\' + name)
            try:
                open_and_save_text(root + '\\' + name, name[0:len(name)-4] + '.txt')
            except TypeError:
                print(name)
                print(root)
                open_and_save_text(root + '\\' + name, name[0:len(name)-4] + '.txt')



convert_all_xml_to_txt()














