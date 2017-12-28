# translate from fcp xml special effect to ffmpeg filter


class NotSupportedFcpEffect(Exception):
    pass


translate_table = {
    'adjust-crop': {
        'name': 'crop',
        'values': ['iw/2', 'ih', 'iw/2', '0'],
        'kwvalues': {}
    },
    'filter-video': {
        'name': 'hue',
        'values': [],
        'kwvalues': {
            's': '0'
        }
    },
}


def fcp_effect_to_ffmpeg_filter(fcp_effect):
    ''' Translate a fcp effect into a ffmpeg filter '''
    if fcp_effect not in translate_table:
        raise NotSupportedFcpEffect("%s is not supported yet." % fcp_effect)
    else:
        return translate_table[fcp_effect]
