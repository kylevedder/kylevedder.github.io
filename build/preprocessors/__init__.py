from .header import process_header_line
from .header import SENTINAL as HEADER_SENTINAL
from .pubs import process_pub_line
from .pubs import SENTINAL as PUBS_SENTINAL
from .sop import process_sop_line
from .sop import SENTINAL as SOP_SENTINAL

processor_map = {
    HEADER_SENTINAL: process_header_line,
    PUBS_SENTINAL: process_pub_line,
    SOP_SENTINAL: process_sop_line,
}