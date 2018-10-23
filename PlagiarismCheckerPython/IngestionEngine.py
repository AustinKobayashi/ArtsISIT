import re

class IngestionEngine:

    def format_text_for_hash(self, text):
        return re.sub(r'[^A-Za-z0-9]', '', text).lower()
