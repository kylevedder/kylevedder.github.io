from .codecogs_save import process_codecogs_line
from .format_html import process_document_into_html

line_processor_list = [
    process_codecogs_line,
]

whole_document_processor_list = [
    process_document_into_html,
]
