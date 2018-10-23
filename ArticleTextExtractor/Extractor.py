import time
import os
import sys

article_path = '/home/austin/Desktop/Projects/Plagiarism Detection/articles_long.txt'
save_path = '/media/austin/Data1/WikipediaArticles/'

num_articles = 0
start_time = time.time()
file = None
distribution = {}

with open(article_path) as all_articles:
    for line in all_articles:
        if '#Article: ' in line:
            num_articles += 1
            article_name = line[10:].rstrip()

            if '/' in article_name:
                first_letter = 'slash'
                article_name = article_name.replace('/', ' \"slash\" ')
            else:
                first_letter = article_name[0:1].lower()

            try:
                distribution[first_letter] += 1
            except KeyError:
                distribution[first_letter] = 1
            except:
                print('Could not add article: {0} to the distribution'.format(article_name))

            if not os.path.isdir(os.path.join(save_path, first_letter)):
                os.mkdir(os.path.join(save_path, first_letter))

            try:
                file = open(os.path.join(save_path, first_letter, article_name + '.txt'), 'w')
            except FileNotFoundError:
                file = open(os.path.join(save_path, article_name + '.txt'), 'w')
            except OSError as e:
                print('\nNumber of Articles: {0}'.format(num_articles))
                print('Distribution:')
                print(distribution)
                sys.exit(e)

        elif file is not None and '#Type' not in line:
            file.write(line)



print('\nNumber of Articles: {0}'.format(num_articles))
print('Took: {0} seconds'.format(time.time() - start_time))
print('Distribution:')
print(distribution)