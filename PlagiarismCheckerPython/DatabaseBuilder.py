import os
import mysql.connector

from IngestionEngine import IngestionEngine
from Winnow import Winnow


def get_document_id(database_cursor, filename):
    try:
        query = """select id from document where text = '%s'""" % filename
        database_cursor.execute(query)
        results = database_cursor.fetchall()
        for result_tuple in results:
            return result_tuple[0]
    except mysql.connector.errors.ProgrammingError:
        print(query)


def get_document_text(filename):
    with open(filename, 'r', encoding='utf8', errors='ignore') as text_file:
        text = text_file.read()
    return text



def add_winnow_fingerprint_to_database(database, database_cursor, value, start, end):
    try:
        query = """insert into winnow_fingerprint (value, start, end) values ('%s', '%s', '%s')""" % (value, start, end)
        database_cursor.execute(query)
        database.commit()
    except mysql.connector.errors.ProgrammingError:
        print(query)


def get_winnow_fingerprint_id(database_cursor, value, start, end):
    try:
        query = """select id from winnow_fingerprint where value = '%s' and start = '%s' and end = '%s'""" % (value, start, end)
        database_cursor.execute(query)
        results = database_cursor.fetchall()
        for result_tuple in results:
            return result_tuple[0]
    except mysql.connector.errors.ProgrammingError:
        print(query)


def add_winnow_document_to_database(database, database_cursor, document_id, winnow_id):
    try:
        query = """insert into winnow_document (document_id, winnow_id) values ('%s', '%s')""" % (document_id, winnow_id)
        database_cursor.execute(query)
        database.commit()
    except mysql.connector.errors.ProgrammingError:
        print(query)



def add_winnow_to_database(database, database_cursor, directory):
    ingestion_engine = IngestionEngine()
    k = 25
    w = 30

    for filename in os.listdir(directory):
        if filename.endswith('.txt'):
            document_id = get_document_id(database_cursor, os.path.join(directory, filename.replace("'", r"\'").replace('"', r'\"')))

            document_text = get_document_text(os.path.join(directory, filename))
            formatted_text = ingestion_engine.format_text_for_hash(document_text)

            winnow = Winnow(k)
            fingerprint = winnow.winnow(w, document_text, formatted_text)

            for key, value in fingerprint.items():
                add_winnow_fingerprint_to_database(database, database_cursor, int(key), value[0], value[1])
                winnow_id = get_winnow_fingerprint_id(database_cursor, int(key), value[0], value[1])
                add_winnow_document_to_database(database, database_cursor, document_id, winnow_id)



def main():
    directory = '/media/austin/Data1/WikipediaArticles/z/'
    #directory = '/home/austin/Desktop/Projects/Plagiarism Detection/PlagiarismChecker/text_files/original_texts/'

    database = mysql.connector.connect(host='127.0.0.1',
                                       user='root',
                                       password='password',
                                       database='PlagiarismDetection',
                                       auth_plugin='mysql_native_password')

    database_cursor = database.cursor()

    add_winnow_to_database(database, database_cursor, directory)

    # k = 25
    # w = 30
    # file1 = '/home/austin/Desktop/Projects/Plagiarism Detection/PlagiarismChecker/text_files/original_texts/example1o.txt'
    # file2 = '/home/austin/Desktop/Projects/Plagiarism Detection/PlagiarismChecker/text_files/plagiarized_text/example1p.txt'
    #
    # winnow1 = Winnow(k)
    # winnow2 = Winnow(k)
    # ingestion_engine = IngestionEngine()
    #
    # with open(file1, 'r', encoding='utf8', errors='ignore') as text_file:
    #     original_text = text_file.read()
    #
    # with open(file2, 'r', encoding='utf8', errors='ignore') as text_file:
    #     plagiarized_text = text_file.read()
    #
    # original_formatted_text = ingestion_engine.format_text_for_hash(original_text)
    # plagiarized_formatted_text = ingestion_engine.format_text_for_hash(plagiarized_text)
    #
    # fingerprint1 = winnow1.winnow(w, original_text, original_formatted_text)
    # fingerprint2 = winnow2.winnow(w, plagiarized_text, plagiarized_formatted_text)
    #
    # for key, value in fingerprint1.items():
    #     if key in fingerprint2:
    #         print('match on: {0}'.format(key))
    #         print('   {0}'.format(original_text[fingerprint1[key][0] : fingerprint1[key][1]]))
    #         print('   {0}'.format(plagiarized_text[fingerprint2[key][0] : fingerprint2[key][1]]))


if __name__ == '__main__':
    main()
