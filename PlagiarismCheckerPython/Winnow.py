import re
import sys

from HashFunction import HashFunction


class Winnow:

    def __init__(self, k):
        self.k = k
        self.num_non_letter_chars = 0

        self.hash_function = HashFunction(k)
        self.fingerprints = {}
        self.global_pos = 0
        self.global_positions = {}



    def winnow(self, window_size, original_text, formatted_text):

        window = [None] * window_size
        k_grams = [sys.maxsize] * window_size
        r = 0
        minimum = 0

        prev_k_gram = formatted_text[0 : self.k]
        k_grams[0] = prev_k_gram
        prev_hash = self.hash_function.Hash(prev_k_gram)

        for i in range(len(formatted_text) - window_size):

            r = (r + 1) % window_size

            if i == 0:
                window[r] = prev_hash
            else:
                prev_hash = self.hash_function.RollingHash(prev_hash, prev_k_gram, formatted_text[i : i + self.k])
                window[r] = prev_hash

            prev_k_gram = formatted_text[i : i + self.k]
            k_grams[r] = prev_k_gram
            self.update_global_positions(original_text, r)

            if minimum == r:

                j = (r - 1) % window_size

                while j != r:
                    if window[j] < window[minimum]:
                        minimum = j

                    j = (j - 1 + window_size) % window_size

                self.record(window[minimum], minimum, r, window_size, i, k_grams[minimum], original_text, self.global_positions[self.mod(minimum - 1, window_size)])

            else:

                if window[minimum] is not None and window[r] <= window[minimum]:
                    minimum = r
                    self.record(window[minimum], minimum, r, window_size, i, k_grams[minimum], original_text, self.global_positions[self.mod(minimum - 1, window_size)])

        return self.fingerprints



    def mod(self, number, mod):
        return ((number % mod) + mod) % mod



    def update_global_positions(self, original_text, r):

        self.global_pos += 1

        while re.search('\W', original_text[self.global_pos]):
            self.global_pos += 1

        self.global_positions[r] = self.global_pos



    def get_k_gram_end_position(self, original_text, pos):

        num_chars = 0
        while num_chars != self.k:
            if re.search('\w', original_text[pos]):
                num_chars += 1
            pos += 1
        return pos



    def record(self, hash, minimum, r, w, i, k_gram, original_text, pos):
        self.fingerprints[hash] = [pos, self.get_k_gram_end_position(original_text, pos)]


















