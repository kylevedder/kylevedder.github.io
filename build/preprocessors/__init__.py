from .header import process_header_line
from .header import SENTINAL as HEADER_SENTINAL
from .pubs import process_pub_line
from .pubs import SENTINAL as PUBS_SENTINAL

processor_map = {
    HEADER_SENTINAL: process_header_line,
    PUBS_SENTINAL: process_pub_line,
}