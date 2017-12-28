#
# Convert all the json files/strings into proper python objects.
# Convert all the python objects back into json strings.
# Split fcp cake ranges into non-overlap cakes
import json


def json_file_to_jsonobj(filename):
    with open(filename, 'r') as f:
        json_string = ''.join(f.readlines())
        return json.loads(json_string)


def json_string_to_jsonobj(json_str):
    return json.loads(json_str)


# Result of 'split_ranges()' is:
# [{ # --- range No.1 ---
#     'range_end': 117,
#     'range_start': 43,
#     'cake_uid': u '3bba5c017ba21f43479c9c5e476e68df-43-117',
#     'clips': [{
#         u 'video': {
#             u 'duration': 441,
#             u 'audio': {
#                 u 'lane': u '-1',
#                 u 'srcCh': u '1',
#                 u 'role': u 'dialogue',
#                 u 'offset': u '0s',
#                 u 'duration': u '10587408/720000s',
#                 u 'ref': u 'r2'
#             },
#             u 'ref': u 'r2',
#             u 'offset': 0
#         },
#         u 'offset': 0
#     }]
# },{
#   # --- range No.2 ---
# }]


def split_ranges(cake_hash, cake):
    ''' Helper function: Input a fcp cake dict, return a list of bake jobs.
        Without the overlapping of range, so split ranges.
    '''
    cakes_container = []
    for each in cake['ranges']:
        temp_obj = {}
        temp_obj['cake_uid'] = '%s-%d-%d' % (cake_hash, each['start'],
                                             each['end'])
        temp_obj['range_start'] = each['start']
        temp_obj['range_end'] = each['end']
        temp_obj['clips'] = cake['clips']
        cakes_container.append(temp_obj)

    return cakes_container
