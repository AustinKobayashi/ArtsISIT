import time
import os
import math
import multiprocessing as mp

def get_sub_directory_partition(directory, start, end):
    sub_dirs = []
    for i in range (start, end):
        if os.path.isdir(os.path.join(directory, os.listdir(directory)[i])):
            sub_dirs.append(os.listdir(directory)[i].decode('utf-8'))
    return  sub_dirs


def get_sub_directory_args(num_processes, number_of_files, directory):

    partition = math.ceil(number_of_files / num_processes)
    i = 0
    args = []

    while i < number_of_files:
        if i + partition >= number_of_files:
            partition = number_of_files - i
        args.append((directory, i, partition + i))
        i += partition

    return args


def concat_sub_directories(results):
    sub_directories = []
    for result in results:
        sub_directories += result
    return sub_directories


def get_sub_directories(path):
    num_processes = 6

    directory = os.fsencode(path)
    start_time = time.time()
    number_of_files = 5015630  # len(os.listdir(directory))

    print('{0} files'.format(number_of_files))

    if num_processes > number_of_files:
        num_processes = number_of_files

    sub_directory_args = get_sub_directory_args(num_processes, number_of_files, directory)

    pool = mp.Pool(processes=num_processes)
    results = pool.starmap_async(get_sub_directory_partition, sub_directory_args).get()
    pool.close()
    pool.join()
    sub_directories = concat_sub_directories(results)

    print('\nTook: {0} seconds'.format(time.time() - start_time))
    print('\nCurrent Sub Directories:')
    print(sub_directories)



def main():

    path = '/media/austin/Data1/WikipediaArticles'

    directory = os.fsencode(path)
    start_time = time.time()
    number_of_files = 5015630 #len(os.listdir(directory))

    print('{0} files'.format(number_of_files))

    names = {}

    for i in range (number_of_files):
        if os.path.isdir(os.path.join(directory, os.listdir(directory)[i])):
            print('=============================================')
            print('Found Directory: ')
            print(os.listdir(directory)[i].decode('utf-8'))
            print('=============================================')
        try:
            names[os.listdir(directory)[i].decode('utf-8')] += 1
        except KeyError:
            names[os.listdir(directory)[i].decode('utf-8')] = 1

        if i % 1000 == 0:
            print(names)

    print('\nTook: {0} seconds'.format(time.time() - start_time))





if __name__ == "__main__":
    main()








# sub_directories = [subdir for subdir in os.listdir(path) if os.path.isdir(os.path.join(path, subdir))]
#
# print('Current Sub Directories:')
# print(sub_directories)
#
# moved_files = {}
#
# for file in os.listdir(directory):
#     filename = os.fsdecode(file)
#
#     if filename.endswith(".txt"):
#         first_letter = filename[0:1]
#
#         if first_letter not in sub_directories:
#             os.mkdir(os.path.join(directory, str.encode(first_letter)))
#             moved_files[first_letter] = 0
#             sub_directories.append(first_letter)
#
#         os.rename(os.path.join(directory, file), os.path.join(directory, str.encode(first_letter), file))
#         moved_files[first_letter] += 1
#
# print('Took: {0} seconds'.format(time.time() - start_time))
# print('New Folder Distribution:')
# print(moved_files)
