class HashFunction:

    def __init__(self, k_gram_length):
        self.base = 3
        self.prime = 1301081

        if k_gram_length > 2:
            self.base_offset = self.base % self.prime

            for i in range(1, k_gram_length - 1):
                self.base_offset = (self.base_offset * self.base) % self.prime

        else:
            self.base_offset = self.base



    def Hash(self, k_gram):

        hash = 0

        for i in range(len(k_gram)):
            hash = ((hash + ord(k_gram[i])) % self.prime) * self.base

        return hash / self.base



    def RollingHash(self, old_hash, prev_k_gram, k_gram):

        if prev_k_gram == k_gram:
            return self.Hash(k_gram)

        a = old_hash + self.prime
        b = ord(prev_k_gram[0]) * self.base_offset % self.prime
        c = (a - b) * self.base
        d = c + ord(k_gram[len(k_gram) - 1])
        return d % self.prime
