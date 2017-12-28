# UNSTABLE
# Filter graph of ffmpeg consists of multiple "chians".
# Each chain looks like this:
# [in_pad][in_pad]... filter, filter, filter [out_pad][out_pad]...
# Multiple inputs and outputs, they are called pads.
# Between pads, are the filters to be applied in sequence to the video/audio
# We generate suitable filter string in this file.


def make_filter(name, *args, **kwargs):
    ''' Make a filter. The string has four forms:
        filter
        filter=value:value:value
        filter=key=value:key=value:key=value
        filter=value:value:key=value:key=value
    '''
    if not args and not kwargs:
        return name
    else:
        prefix = name + '='
        values = ':'.join(args)
        kw = [('%s=%s' % (each, kwargs[each])) for each in kwargs]
        kwvalues = ':'.join(kw)

        if args and kwargs:
            return prefix + values + ':' + kwvalues
        elif not args:
            return prefix + kwvalues
        else:
            return prefix + values


# Deprecated
class NoSuchPresetFilter(Exception):
    pass


# Deprecated
preset_filters = {
    'black-and-white': 'hue=s=0',
    'vflip': 'vflip',
    'hflip': 'hflip',
    'fifo': 'fifo',
    'frame-align': 'setpts=PTS-STARTPTS',
    'overlay': 'overlay',
    'setpts': 'setpts',
    'trim': 'trim',
}


# Deprecated
def get_preset_filter(name):
    ''' Deprecated method, use make_filter() instead
        Instead of making a filter by hand,
        We generate a preset filter, if we have the name.
    '''
    try:
        return preset_filters[name]
    except KeyError:
        raise NoSuchPresetFilter('filter name %s not found' % name)
